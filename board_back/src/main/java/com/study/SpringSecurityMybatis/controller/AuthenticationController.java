package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.*;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import com.study.SpringSecurityMybatis.service.TokenService;
import com.study.SpringSecurityMybatis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class AuthenticationController {

    @Autowired
    private UserService userService;
    @Autowired
    private OAuth2Service oAuth2Service;

    @Autowired
    private TokenService tokenService;

    @ValidAop
    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody ReqSignupDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(userService.insertUserAndUserRoles(dto));
    }

    @ValidAop
    @PostMapping("/auth/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody ReqSigninDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(userService.getGeneratedAccessToken(dto));
    }

    @ValidAop
    @PostMapping("/auth/oauth2/merge")
    public ResponseEntity<?> oAuth2Merge(@Valid @RequestBody ReqOAuth2MergeDto dto, BindingResult bindingResult) {
        OAuth2User oAuth2User = userService.mergeSignin(dto);
        oAuth2Service.merge(oAuth2User);
        return ResponseEntity.ok().body(true);
    }

    @ValidAop
    @PostMapping("/auth/oauth2/signup")
    public ResponseEntity<?> oAuth2Signup(@Valid @RequestBody ReqOAuth2SignupDto dto, BindingResult bindingResult) throws SignupException {
        oAuth2Service.signup(dto);
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/auth/access")
    public ResponseEntity<?> access(ReqAccessDto dto) {
        return ResponseEntity.ok().body(tokenService.isValidAccessToken(dto.getAccessToken()));
    }

}










