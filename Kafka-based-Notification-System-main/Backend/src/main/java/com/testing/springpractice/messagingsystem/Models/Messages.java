package com.testing.springpractice.messagingsystem.Models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    private Users sender;
    @ManyToMany
    private List<Users> receivers;
    @Column(nullable = false)
    private String subject;
    @Column(nullable = false)
    private String content;
    private String attachmentUrl;
    private String attachmentType;
    @ManyToMany
    @Builder.Default
    private Set<Users> readBy = new HashSet<>();
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EmailStatus emailStatus = EmailStatus.PENDING;
    @Builder.Default
    private Integer emailAttempts = 0;

}
