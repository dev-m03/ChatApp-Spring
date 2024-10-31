package com.example.ChatApp;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GreetingController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting( Greeting message) throws Exception {
        // Simulated delay
        Thread.sleep(1000);

        // Create and return Greeting object with both name and message
        return new Greeting(message.getName(), message.getMessage());
    }
}

