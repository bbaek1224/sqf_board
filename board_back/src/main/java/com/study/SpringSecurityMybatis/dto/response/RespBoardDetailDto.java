package com.study.SpringSecurityMybatis.dto.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RespBoardDetailDto {
    private Long boardId;
    private String title;
    private String content;
    private Long writerId;
    private String writerUsername;
    private int viewCount;
}
