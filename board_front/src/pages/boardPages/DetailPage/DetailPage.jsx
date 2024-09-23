/** @jsxImportSource @emotion/react */
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../../apis/util/instance";
import { css } from "@emotion/react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useState } from "react";

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 300px;
    width: 1100px;
`;

const header = css`
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    padding: 10px 15px;
    & > h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 38px;
        cursor: default;
    }
`;

const titleAndLike = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        background-color: #ffffff;
        cursor: pointer;

        & > svg {
            font-size: 30px;
        }
    }
`;

const boardInfoContainer = css`
    display: flex;
    justify-content: space-between;

    & span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: default;
    }

    & button {
        box-sizing: border-box;
        margin-left: 5px;
        border: 1px solid #dbdbdb;
        padding: 5px 20px;
        background-color: white;
        font-size: 12px;
        font-weight: 600;
        color: #333333;
        cursor: pointer;
        &:hover {
            background-color: #fafafa;
        }
        &:active {
            background-color: #eeeeee;
        }
    }
`;

const contentBox = css`
    box-sizing: border-box;
    margin-top: 5px;
    border: 1px solid #dbdbdb;
    padding: 0px 15px;
    & img:not(img[width]) {
        width: 100%;
    }
`;

const commentContainer = css`
    margin-bottom: 50px;
`;

const commentWriteBox = (level) => css`
    display: flex;
    box-sizing: border-box;
    margin-top: 5px;
    margin-left: ${level * 3}%;
    height: 80px;
    
    & > textarea {
        flex-grow: 1;
        margin-right: 5px;
        border: 1px solid #dbdbdb;
        outline: none;
        padding: 12px 15px;
        resize: none;
        
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        width: 80px;
        background-color: #ffffff;
        cursor: pointer;
    }
`;

const commentListContainer = (level) => css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-left: ${level * 3}%;
    border-bottom: 1px solid #dbdbdb;
    padding: 12px 15px;

    & > div:nth-of-type(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
        border: 1px solid #dbdbdb;
        border-radius: 50%;
        width: 70px;
        height: 70px;
        overflow: hidden;
        & > img {
            height: 100%;
        }
    }
`;

const commentDetail = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const detailHeader = css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;

    & > span:nth-of-type(1) {
        font-weight: 600;
        cursor: default;
    }
`;

const detailContent = css`
    margin-bottom: 10px;
    max-height: 50px;
    overflow-y: auto;
`;

const detailButtons = css`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    & button {
        box-sizing: border-box;
        margin-left: 4px;
        border: 1px solid #dbdbdb;
        padding: 5px 10px;
        background-color: #ffffff;
        cursor: pointer;
    }
`;

function DetailPage(props) {
    const navigate = useNavigate();
    const params = useParams();
    const boardId = params.boardId;

    const queryClient = useQueryClient();
    const userInfoData = queryClient.getQueryData("userInfoQuery");

    const [commentData, setCommentData] = useState({
        boardId,
        parentId: null,
        content: "",
    });

    const [commentModifyData, setCommentModifyData] = useState({
        commentId: 0,
        content: "",
    });

    const board = useQuery(
        ["boardQuery", boardId],
        async () => {
            return instance.get(`/board/${boardId}`);
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const boardLike = useQuery(
        ["boardLikeQuery"],
        async () => {
            return instance.get(`/board/${boardId}/like`);
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const comments = useQuery(
        ["commentsQuery"],
        async () => {
            return await instance.get(`/board/${boardId}/comments`);
        },
        {
            retry: 0,
        }
    );

    const likeMutation = useMutation(
        async () => {
            return await instance.post(`/board/${boardId}/like`)
        },
        {
            onSuccess: response => {
                boardLike.refetch();
            }
        }
    );

    const dislikeMutation = useMutation(
        async () => {
            return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`)
        },
        {
            onSuccess: response => {
                boardLike.refetch();
            }
        }
    );

    const commentMutation = useMutation(
        async () => {
            return await instance.post("/board/comment", commentData);
        },
        {
            onSuccess: response => {
                alert("댓글 작성이 완료되었습니다.");
                setCommentData({
                    boardId,
                    parentId: null,
                    content: "",
                });
                comments.refetch();
            }
        }
    );

    const modifyCommentMutation = useMutation(
        async () => await instance.put(`/board/comment/${commentModifyData.commentId}`, commentModifyData),
        {
            onSuccess: () => {
                alert("댓글 수정이 완료되었습니다.");
                setCommentModifyData({
                    commentId: 0,
                    content: "",
                });
                comments.refetch();
            }
        }
    );

    const deleteCommentMutaion = useMutation(
        async (commentId) => await instance.delete(`/board/comment/${commentId}`),
        {
            onSuccess: response => {
                alert("댓글을 삭제하였습니다.");
                comments.refetch();
            }
        }
    );

    const handleLikeOnClick = () => {
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login");
            }
            return;
        }
        likeMutation.mutateAsync();
    }

    const handleDislikeOnClick = () => {
        dislikeMutation.mutateAsync();
    }

    const handleCommentInputOnChange = (e) => {
        setCommentData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value,
        }));
    }

    const handleCommentModifyInputOnChange = (e) => {
        setCommentModifyData(commentData => ({
            ...commentData,
            [e.target.name]: e.target.value,
        }));
    }

    const handleCommentSubmitOnClick = () => {
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login");
            }
            return;
        }
        commentMutation.mutateAsync();
    }

    const handleCommentModifySubmitOnClick = () => {
        modifyCommentMutation.mutateAsync();
    }

    const handleReplyButtonOnClick = (commentId) => {
        setCommentData(commentData => ({
            boardId,
            parentId: commentId === commentData.parentId ? null : commentId,
            content: "",
        }));
    }

    const handleModifyCommentButtonOnClick = (commentId, content) => {
        setCommentModifyData(commentData => ({
            commentId,
            content
        }));
    }

    const handleModifyCommentCancelButtonOnClick = () => {
        setCommentModifyData(commentData => ({
            commentId: 0,
            content: ""
        }));
    }

    const handleDeleteCommentButtonOnClick = (commentId) => {
        deleteCommentMutaion.mutateAsync(commentId);
    }

    return (
        <div css={layout}>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            {
                board.isLoading && <></>
            }
            {
                board.isError && <h1>{board.error.response.data}</h1>
            }
            {
                board.isSuccess &&
                <>
                    <div css={header}>
                        <div css={titleAndLike}>
                            <h1>{board.data.data.title}</h1>
                            <div>
                                {
                                    !!boardLike?.data?.data?.boardLikeId
                                        ?
                                        <button onClick={handleDislikeOnClick}>
                                            <IoMdHeart />
                                        </button>
                                        :
                                        <button onClick={handleLikeOnClick}>
                                            <IoMdHeartEmpty />
                                        </button>
                                }


                            </div>
                        </div>
                        <div css={boardInfoContainer}>
                            <div>
                                <span>
                                    작성자: {board.data.data.writerUsername}
                                </span>
                                <span>
                                    조회: {board.data.data.viewCount}
                                </span>
                                <span>
                                    추천: {boardLike?.data?.data.likeCount}
                                </span>
                            </div>
                            <div>
                                {
                                    board.data.data.writerId === userInfoData?.data.userId &&
                                    <>
                                        <button>수정</button>
                                        <button>삭제</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div css={contentBox} dangerouslySetInnerHTML={{
                        __html: board.data.data.content
                    }}>
                    </div>
                    <div css={commentContainer}>
                        <h2>댓글 {comments?.data?.data.commentCount}</h2>
                        {
                            commentData.parentId === null &&
                            <div css={commentWriteBox(0)}>
                                <textarea name="content" onChange={handleCommentInputOnChange} value={commentData.content} placeholder="댓글을 입력하세요."></textarea>
                                <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                            </div>
                        }
                        <div>
                            {
                                comments?.data?.data.comments.map(comment =>
                                    <div key={comment.id}>
                                        <div css={commentListContainer(comment.level)}>
                                            <div>
                                                <img src={comment.img} alt="" />
                                            </div>
                                            <div css={commentDetail}>
                                                <div css={detailHeader}>
                                                    <span>{comment.username}</span>
                                                    <span>{new Date(comment.createDate).toLocaleString()}</span>
                                                </div>
                                                <pre css={detailContent}>{comment.content}</pre>
                                                <div css={detailButtons}>
                                                    {
                                                        userInfoData?.data?.userId === comment.writerId &&
                                                        <div>
                                                            {
                                                                commentModifyData.commentId === comment.id
                                                                    ?
                                                                    <button onClick={handleModifyCommentCancelButtonOnClick}>취소</button>
                                                                    :
                                                                    <button onClick={() => handleModifyCommentButtonOnClick(comment.id, comment.content)}>수정</button>
                                                            }
                                                            <button onClick={() => handleDeleteCommentButtonOnClick(comment.id)}>삭제</button>
                                                        </div>
                                                    }
                                                    {
                                                        comment.level < 3 &&
                                                        <div>
                                                            <button onClick={() => handleReplyButtonOnClick(comment.id)}>답글</button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            commentData.parentId === comment.id &&
                                            <div css={commentWriteBox(comment.level)}>
                                                <textarea name="content" onChange={handleCommentInputOnChange} value={commentData.content} placeholder="답글을 입력하세요."></textarea>
                                                <button onClick={handleCommentSubmitOnClick}>작성하기</button>
                                            </div>
                                        }
                                        {
                                            commentModifyData.commentId === comment.id &&
                                            <div css={commentWriteBox(comment.level)}>
                                                <textarea name="content" onChange={handleCommentModifyInputOnChange} value={commentModifyData.content} placeholder="답글을 입력하세요."></textarea>
                                                <button onClick={handleCommentModifySubmitOnClick}>수정하기</button>
                                            </div>
                                        }
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </>
            }
        </div >
    );
}

export default DetailPage;