package com.testing.springpractice.messagingsystem.Controllers;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.SendMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview;
import com.testing.springpractice.messagingsystem.Service.MessageService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/sent")
    public Page<DetailedMessage> getSentMessages(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return messageService.getSentMessages(companyId, page, size);
    }

    @GetMapping("/inbox")
    public Page<MessageOverview> getInboxMessages(
            @RequestParam(required = false) UUID companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return messageService.getInboxMessages(companyId, page, size);
    }

    @GetMapping("/{companyId}")
    public Page<MessageOverview> getAllMessages(@PathVariable UUID companyId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return messageService.getAllMessages(companyId,page,size);
    }
    @GetMapping("/inbox/{companyId}/{messageId}")
    public DetailedMessage getMessage(@PathVariable UUID messageId, @PathVariable UUID companyId){
        return messageService.getMessage(messageId, companyId);
    }
    @PostMapping("/sendMessage/{companyId}")
    public String sendMessage(@PathVariable UUID companyId, @RequestPart @Valid SendMessage request, @RequestPart(required = false) MultipartFile file) throws IOException {
        return messageService.sendMessage(companyId, request, file);
    }

}
