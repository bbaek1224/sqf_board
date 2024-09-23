/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';
import ImageResize from "quill-image-resize";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import { v4 as uuid } from "uuid";
import { CircleLoader, RingLoader } from "react-spinners";
import { instance } from "../../../apis/util/instance";
import { useNavigate } from "react-router-dom";

Quill.register("modules/imageResize", ImageResize);

const layout = css`
    box-sizing: border-box;
    margin: 0 auto;
    padding-top: 30px;
    width: 1100px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 10px 0px;

    & > h1 {
        margin: 0;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #c0c0c0;
        padding: 6px 15px;
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

const titleInput = css`
    box-sizing: border-box;
    margin-bottom: 10px;
    border: 1px solid #c0c0c0;
    outline: none;
    padding: 12px 15px;
    width: 100%;
    font-size: 16px;
`;

const editorLayout = css`
    box-sizing: border-box;
    margin-bottom: 42px;
    width: 100%;
    height: 700px;
`;

const loadingLayout = css`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #00000033;
`;

function WritePage(props) {
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        title: "",
        content: ""
    });
    const quillRef = useRef(null);
    const [isUploading, setUploading] = useState(false);

    const handleWriteSubmitOnClick = () => {
        console.log(board)
        instance.post("/board", board)
            .then((response) => {
                alert("작성이 완료되었습니다.");
                navigate(`/board/detail/${response.data.boardId}`);
            })
            .catch((error) => {
                const fieldErrors = error.response.data;

                for (let fieldError of fieldErrors) {
                    if (fieldError.field === "title") {
                        alert(fieldError.defaultMessage);
                        return;
                    }
                }
                for (let fieldError of fieldErrors) {
                    if (fieldError.field === "content") {
                        alert(fieldError.defaultMessage);
                        return;
                    }
                }
            });
    }

    const handleWriteSubmitOnClick2 = async () => {
        try {
            const response = await instance.post("/board", board)
            alert("작성이 완료되었습니다.");
            navigate(`/board/detail/${response.data.boardId}`);
        } catch (error) {
            const fieldErrors = error.response.data;

            for (let fieldError of fieldErrors) {
                if (fieldError.field === "title") {
                    alert(fieldError.defaultMessage);
                    return;
                }
            }
            for (let fieldError of fieldErrors) {
                if (fieldError.field === "content") {
                    alert(fieldError.defaultMessage);
                    return;
                }
            }
        }
    }

    const handleTitleInputOnChange = (e) => {
        setBoard(board => ({
            ...board,
            [e.target.name]: e.target.value,
        }));
    }

    const handleQuillValueOnChange = (value) => {
        setBoard(board => ({
            ...board,
            content: quillRef.current.getEditor().getText().trim() === "" ? "" : value,
        }));
    }

    const handleImageLoad = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.onchange = () => {
            const editor = quillRef.current.getEditor();
            const files = Array.from(input.files);
            const imgFile = files[0];

            const editPoint = editor.getSelection(true);

            const storageRef = ref(storage, `board/img/${uuid()}_${imgFile.name}`);
            const task = uploadBytesResumable(storageRef, imgFile);
            setUploading(true);
            task.on(
                "state_changed",
                () => { },
                () => { },
                async () => {
                    const url = await getDownloadURL(storageRef);
                    editor.insertEmbed(editPoint.index, "image", url);
                    editor.setSelection(editPoint.index + 1);
                    editor.insertText(editPoint.index + 1, "\n");
                    setUploading(false);
                    setBoard(board => ({
                        ...board,
                        content: editor.root.innerHTML,
                    }));
                }
            );
        }

    }, []);

    const toolbarOptions = useMemo(() => [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }, { 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
    ], []);

    return (
        <div css={layout}>
            <header css={header}>
                <h1>Quill Edit</h1>
                <button onClick={handleWriteSubmitOnClick}>작성하기</button>
            </header>
            <input css={titleInput} type="text" name="title" onChange={handleTitleInputOnChange} value={board.title} placeholder="게시글의 제목을 입력하세요." />
            <div css={editorLayout}>
                {
                    isUploading &&
                    <div css={loadingLayout}>
                        <RingLoader />
                    </div>
                }
                <ReactQuill
                    ref={quillRef}
                    style={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%"
                    }}
                    onChange={handleQuillValueOnChange}
                    modules={{
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: handleImageLoad,
                            }
                        },
                        imageResize: {
                            parchment: Quill.import("parchment")
                        },
                    }}
                    value={board.content}
                />
            </div>
        </div>
    );
}

export default WritePage;