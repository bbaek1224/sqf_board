package com.study.SpringSecurityMybatis.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReqSearchBoardDto {
    private Long page;
    private Long limit;
    private String search;
    private String option;
}