import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import UserJoinPage from "./pages/UserJoinPage/UserJoinPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { instance } from "./apis/util/instance";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import OAuth2JoinPage from "./pages/OAuth2JoinPage/OAuth2JoinPage";
import OAuth2LoginPage from "./pages/OAuth2LoginPage/OAuth2LoginPage";
import WritePage from "./pages/boardPages/WritePage/WritePage";
import DetailPage from "./pages/boardPages/DetailPage/DetailPage";
import NumberBoardListPage from "./pages/boardPages/NumberBoardListPage/NumberBoardListPage";
import ScrollBoardListPage from "./pages/boardPages/ScrollBoardListPage/ScrollBoardListPage";
import SearchBoardPage from "./pages/boardPages/SearchBoardPage/SearchBoardPage";

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ authRefresh, setAuthRefresh ] = useState(true);
    /**
     * 페이지 이동시 Auth(로그인, 토큰) 확인
     * 1. index(home) 페이지를 먼저 들어가서 로그인 페이지로 이동한 경우 -> index로 이동
     * 2. 탭을 열자마자 주소창에 수동입력을 통해 로그인 페이지로 이동한 경우 -> index로 이동
     * 3. 로그인 후 사용 가능한 페이지로 들어갔을 때 로그인 페이지로 이동한 경우 -> 이전 페이지 이동
     * 4. 로그인이 된 상태 -> 어느 페이지든 이동
     */

    useEffect(() => {
        if(!authRefresh) {
            setAuthRefresh(true);
        }
    }, [location.pathname]);

    const accessTokenValid = useQuery(
        ["accessTokenValidQuery"], 
        async () => {
            setAuthRefresh(false);
            return await instance.get("/auth/access", {
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            });
        }, 
        {
            enabled: authRefresh,
            retry: 0,
            refetchOnWindowFocus: false,
            onSuccess: response => {
                const permitAllPaths = ["/user"];
                for(let permitAllPath of permitAllPaths) {
                    if(location.pathname.startsWith(permitAllPath)){
                        navigate("/");
                        break;
                    }
                }
            },
            onError: error => {
                const authPaths = ["/profile"];
                for(let authPath of authPaths) {
                    if(location.pathname.startsWith(authPath)){
                        navigate("/user/login");
                        break;
                    }
                }
            }
        }
    );

    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me");
        },
        {
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data,
            refetchOnWindowFocus: false,
        }
    );

    return (
        <Routes>
            <Route path="/" element={ <IndexPage /> } />
            <Route path="/user/join" element={ <UserJoinPage /> } />
            <Route path="/user/join/oauth2" element={ <OAuth2JoinPage /> } />
            <Route path="/user/login" element={ <UserLoginPage /> } />
            <Route path="/user/login/oauth2" element={ <OAuth2LoginPage /> } />
            <Route path="/profile" element={ <UserProfilePage />} />

            <Route path="/board/search" element={ <SearchBoardPage /> }/>
            <Route path="/board/number" element={ <NumberBoardListPage /> }/>
            <Route path="/board/scroll" element={ <ScrollBoardListPage /> }/>
            <Route path="/board/detail/:boardId" element={ <DetailPage /> }/>
            <Route path="/board/write" element={ <WritePage /> } />


            <Route path="/admin/*" element={ <></> } />
            <Route path="/admin/*" element={ <h1>Not Found</h1> } />
            <Route path="*" element={ <h1>Not Found</h1> } />
        </Routes>
    );
}

export default App;
