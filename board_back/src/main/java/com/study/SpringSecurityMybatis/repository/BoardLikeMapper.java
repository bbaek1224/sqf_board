package com.study.SpringSecurityMybatis.repository;

import com.study.SpringSecurityMybatis.entity.BoardLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BoardLikeMapper {
    int save(BoardLike boardLike);
    int deleteById(Long id);
    BoardLike findByBoardIdAndUserId(
            @Param("boardId") Long boardId,
            @Param("userId") Long UserId);
    int getLikeCountByBoardId(Long boardId);
}
