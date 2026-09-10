package com.eurobar.eurobar_backend;

import com.eurobar.eurobar_backend.config.SecurityConfig;
import com.eurobar.eurobar_backend.controller.UserController;
import com.eurobar.eurobar_backend.entities.User;
import com.eurobar.eurobar_backend.repositories.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserSecurityTests {
    @Autowired MockMvc mvc;
    @MockBean UserRepository users;

    @Test void anonymousCannotReadAccounts() throws Exception {
        mvc.perform(get("/api/users")).andExpect(status().isUnauthorized());
    }
    @Test void accountResponseDoesNotContainPassword() throws Exception {
        when(users.findById(1L)).thenReturn(Optional.of(new User("alice", "secret-hash", "alice@example.org")));
        mvc.perform(get("/api/users/1").with(user("alice"))).andExpect(status().isOk()).andExpect(jsonPath("$.password").doesNotExist());
    }
    @Test void cannotDeleteAnotherAccount() throws Exception {
        when(users.findById(1L)).thenReturn(Optional.of(new User("alice", "secret-hash", "alice@example.org")));
        mvc.perform(delete("/api/users/1").with(user("bob")).with(csrf())).andExpect(status().isNotFound());
        verify(users, never()).delete(any());
    }
    @Test void registrationRequiresCsrf() throws Exception {
        mvc.perform(post("/api/users/register").contentType("application/json").content("{}"))
            .andExpect(status().isForbidden());
    }
    @Test void registrationHashesPassword() throws Exception {
        when(users.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        mvc.perform(post("/api/users/register").with(csrf()).contentType("application/json")
            .content("{\"username\":\"alice\",\"email\":\"alice@example.org\",\"password\":\"long-enough-password\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.password").doesNotExist());
        verify(users).save(argThat(u -> u.getPassword().startsWith("$2a$12$") && !u.getPassword().equals("long-enough-password")));
    }
}
