const {StatusCodes} = require("http-status-codes");
module.exports={
    status :{
 //접근에 성공했을 때 
  SUCCESS : { status: StatusCodes.OK, "isSuccess":true, "code":200, "message":"success to connect"},

  //서버 측 에러
  INTERNAL_SERVER_ERROR: {status: StatusCodes.INTERNAL_SERVER_ERROR, "isSuccess": false, "code": "COMMON000", "message": "서버 에러, 관리자에게 문의 바랍니다." },
  BAD_REQUEST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "COMMON001", "message": "잘못된 요청입니다." },
  UNAUTHORIZED: {status: StatusCodes.UNAUTHORIZED, "isSuccess": false, "code": "COMMON002", "message": "권한이 잘못되었습니다." },
  METHOD_NOT_ALLOWED: {status: StatusCodes.METHOD_NOT_ALLOWED, "isSuccess": false, "code": "COMMON003", "message": "지원하지 않는 Http Method 입니다." },
  FORBIDDEN: {status: StatusCodes.FORBIDDEN, "isSuccess": false, "code": "COMMON004", "message": "금지된 요청입니다." },
  NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "COMMON005", "message": "요청한 페이지를 찾을 수 없습니다. 관리자에게 문의 바랍니다." },

  //사용자 에러
  MEMBER_NOT_FOUND: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4001", "message": "사용자가 없습니다."},
  NICKNAME_NOT_EXIST: {status: StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4002", "message": "닉네임은 필수입니다."},
  EMAIL_ALREADY_EXIST: {status:StatusCodes.BAD_REQUEST, "isSuccess": false, "code": "MEMBER4003", "message": "해당 이메일이 이미 존재합니다."},
  PARAMETER_IS_WRONG: {status:StatusCodes.BAD_REQUEST, "isSuccess":false, "code": "MEMBER4004", "message": "잘못된 인자를 입력했습니다"},


  ARTICLE_NOT_FOUND: {status: StatusCodes.NOT_FOUND, "isSuccess": false, "code": "ARTICLE4001", "message": "게시글이 없습니다."}
}
};