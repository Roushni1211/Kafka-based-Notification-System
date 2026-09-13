package com.testing.springpractice.messagingsystem.ServiceImplementations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.testing.springpractice.messagingsystem.CustomExceptions.CompanyNotExistException;
import com.testing.springpractice.messagingsystem.CustomExceptions.UnauthorizedException;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.SendMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageNotificationEvent;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview;
import com.testing.springpractice.messagingsystem.Models.Company;
import com.testing.springpractice.messagingsystem.Models.EmailStatus;
import com.testing.springpractice.messagingsystem.Models.Messages;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.CompanyRepository;
import com.testing.springpractice.messagingsystem.Repository.MessagesRepository;
import com.testing.springpractice.messagingsystem.Service.MessageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessagesRepository messagesRepository;
    private final CompanyRepository companyRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final Cloudinary cloudinary;

    public MessageServiceImpl(MessagesRepository messagesRepository, CompanyRepository companyRepository, KafkaTemplate<String, Object> kafkaTemplate, Cloudinary cloudinary) {

        this.messagesRepository = messagesRepository;
        this.companyRepository = companyRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.cloudinary = cloudinary;
    }

    @Override
    public Page<MessageOverview> getAllMessages(UUID companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return messagesRepository.ObtainOverviewOfMessages(users.getId(), companyId, pageable);
    }

    @Override
    @Transactional
    public DetailedMessage getMessage(UUID messageId, UUID companyId) {
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Messages message = messagesRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
        if (!message.getReceivers().contains(users)&&!message.getSender().equals(users)){
            throw new UnauthorizedException("Not accessible yo you");
        }
        message.getReadBy().add(users);
        messagesRepository.save(message);

        return messagesRepository.ObtainDetailedMessage(users.getId(), companyId, messageId);
    }

    @Override
    public Page<DetailedMessage> getSentMessages(UUID companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (companyId == null) {
            return messagesRepository.findSentMessages(users.getId(), pageable);
        }
        return messagesRepository.findSentMessagesByCompany(users.getId(), companyId, pageable);
    }

    @Override
    public Page<MessageOverview> getInboxMessages(UUID companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Users users = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (companyId == null) {
            return messagesRepository.findInboxMessages(users.getId(), pageable);
        }
        return messagesRepository.findInboxMessagesByCompany(users.getId(), companyId, pageable);
    }

    @Override
    public String sendMessage(UUID companyId, @Valid SendMessage request, MultipartFile file) throws IOException {
        Company company = companyRepository.findById(companyId).orElseThrow(()->new CompanyNotExistException("Invalid CompanyId"));
        Users sender = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!company.getOwner().equals(sender)&&!company.getEmp().contains(sender)){
            throw new UnauthorizedException("YOU ARE NOT A MEMBER OF THIS");
        }


        Set<UUID> uniqueReceiverIds = new HashSet<>(request.getReceiverIds());
        List<Users> validReceivers = companyRepository.findValidCompanyMembers(company.getId(), uniqueReceiverIds);
        if (validReceivers.size() != uniqueReceiverIds.size()) {
            Set<UUID> foundIds = new HashSet<>();
            for (Users u : validReceivers) {
                foundIds.add(u.getId());
            }
            List<UUID> invalidIds = new ArrayList<>();
            for (UUID id : uniqueReceiverIds) {
                if (!foundIds.contains(id)) {
                    invalidIds.add(id);
                }
            }
            throw new UnauthorizedException("Recipients do not belong to this company: " + invalidIds);
        }
        String attachmentUrl = request.getAttachmentUrl();
        String attachmentType = request.getAttachmentType();
        if (file != null && !file.isEmpty()) {
            Map upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            attachmentUrl = (String) upload.get("secure_url");
            attachmentType = (String) upload.get("resource_type");
        }
        Messages message = Messages.builder()
                .sender(sender)
                .receivers(validReceivers)
                .company(company)
                .subject(request.getSubject())
                .content(request.getContent())
                .attachmentUrl(attachmentUrl)
                .attachmentType(attachmentType)
                .sentAt(LocalDateTime.now())
                .emailStatus(EmailStatus.PENDING)
                .build();

        List<String> recipientEmails = new ArrayList<>();
        for (Users receiver : validReceivers) {
            if (!receiver.getUsername().equalsIgnoreCase(sender.getUsername())) {
                recipientEmails.add(receiver.getUsername());
            }
        }
        message.setEmailStatus(EmailStatus.SENT);
        Messages savedMessage = messagesRepository.save(message);
        if (!recipientEmails.isEmpty()) {

            MessageNotificationEvent event = MessageNotificationEvent.builder()
                    .companyName(company.getName())
                    .senderName(sender.getName())
                    .subject(savedMessage.getSubject())
                    .recipientEmails(recipientEmails)
                    .build();
            kafkaTemplate.send("Message.emailService.newBroadcast", event);

        }
        return "Message Sending Success";
    }
}
