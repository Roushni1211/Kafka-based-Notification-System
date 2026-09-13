package com.testing.springpractice.messagingsystem.DataTransferObjects.EmailDataTransferObjects;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sender {
    private String name;
    private String email;
}
