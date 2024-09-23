package com.study.SpringSecurityMybatis.dto.response;

import com.study.SpringSecurityMybatis.entity.BoardList;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class RespBoardListDto {
    private List<BoardList> boards;
    private Integer totalCount;
}
