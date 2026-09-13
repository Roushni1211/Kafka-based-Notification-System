package com.testing.springpractice.messagingsystem.Service;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.SendMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface MessageService {
    Page<MessageOverview> getAllMessages(UUID companyId, int page, int size);

    DetailedMessage getMessage(UUID messageId, UUID companyId);

    Page<DetailedMessage> getSentMessages(UUID companyId, int page, int size);

    Page<MessageOverview> getInboxMessages(UUID companyId, int page, int size);

    String sendMessage(UUID companyId, SendMessage request, MultipartFile file) throws IOException;
}
