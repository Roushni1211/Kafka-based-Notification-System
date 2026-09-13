package com.testing.springpractice.messagingsystem.Repository;

import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage;
import com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview;
import com.testing.springpractice.messagingsystem.Models.Company;
import com.testing.springpractice.messagingsystem.Models.EmailStatus;
import com.testing.springpractice.messagingsystem.Models.Messages;
import com.testing.springpractice.messagingsystem.Models.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessagesRepository extends JpaRepository<Messages, UUID> {

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview(" +
            "m.id," +
            "m.sender.name," +
            "m.sender.id," +
            "m.subject," +
            "m.sentAt) from Messages m left join m.receivers r where m.company.id = :companyId AND (m.sender.id = :userId OR r.id = :userId) order by m.sentAt desc ")
    Page<MessageOverview> ObtainOverviewOfMessages(UUID userId, UUID companyId, Pageable pageable);

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage(" +
            "m.id," +
            "m.sender.name," +
            "m.subject," +
            "m.content," +
            "m.attachmentUrl," +
            "m.attachmentType," +
            "m.sentAt) " +
            "from Messages m left join m.receivers r where m.company.id = :companyId AND m.id = :messageId AND (m.sender.id=:userId OR r.id = :userId)" )
    DetailedMessage ObtainDetailedMessage(UUID userId, UUID companyId, UUID messageId);

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage(" +
            "m.id," +
            "m.sender.name," +
            "m.subject," +
            "m.content," +
            "m.attachmentUrl," +
            "m.attachmentType," +
            "m.sentAt) from Messages m where m.sender.id = :userId order by m.sentAt desc")
    Page<DetailedMessage> findSentMessages(UUID userId, Pageable pageable);

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.DetailedMessage(" +
            "m.id," +
            "m.sender.name," +
            "m.subject," +
            "m.content," +
            "m.attachmentUrl," +
            "m.attachmentType," +
            "m.sentAt) from Messages m where m.sender.id = :userId and m.company.id = :companyId order by m.sentAt desc")
    Page<DetailedMessage> findSentMessagesByCompany(UUID userId, UUID companyId, Pageable pageable);

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview(" +
            "m.id," +
            "m.sender.name," +
            "m.sender.id," +
            "m.subject," +
            "m.sentAt) from Messages m join m.receivers r where r.id = :userId order by m.sentAt desc")
    Page<MessageOverview> findInboxMessages(UUID userId, Pageable pageable);

    @Query("select distinct new com.testing.springpractice.messagingsystem.DataTransferObjects.MessageDataTransferObjects.MessageOverview(" +
            "m.id," +
            "m.sender.name," +
            "m.sender.id," +
            "m.subject," +
            "m.sentAt) from Messages m join m.receivers r where r.id = :userId and m.company.id = :companyId order by m.sentAt desc")
    Page<MessageOverview> findInboxMessagesByCompany(UUID userId, UUID companyId, Pageable pageable);


}
