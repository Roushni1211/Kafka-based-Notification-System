package com.testing.springpractice.messagingsystem.Models;

import jakarta.persistence.*;
import jdk.dynalink.linker.LinkerServices;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String joinCode;
    private String companyDpUrl;
    private String dpResourceType;
    private String publicUrl;
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Users owner;
    @ManyToMany
    @Builder.Default
    private Set<Users> emp = new HashSet<>();
    @ManyToMany
    @Builder.Default
    private Set<Users> invitations = new HashSet<>();
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    @Override
    public String toString() {
        return "Company{" +
                "name='" + name + '\'' +
                ", owner=" + (owner != null ? owner.getUsername() : "null") +
                '}';
    }

}
