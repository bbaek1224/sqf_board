package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.Comment;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class RespCommentDto {
    private List<Comment> comments;
    private int commentCount;
}
