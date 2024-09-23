package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Comment;
import lombok.Data;

@Data
public class ReqWriteCommentDto {
    private Long boardId;
    private Long parentId;
    private String content;

    public Comment toEntity(Long writerId) {
        return Comment.builder()
                .boardId(boardId)
                .parentId(parentId)
                .content(content)
                .writerId(writerId)
                .build();
    }
}
