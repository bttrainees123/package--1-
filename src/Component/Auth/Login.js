import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import SimpleReactValidator from "simple-react-validator";
import { callAPIWithoutAuth } from '../../utils/apiUtils';
import { apiUrls } from '../../utils/apiUrls';
import { ApiLoder, Button, ErrorMessage, InputFeild, SuccessMessage } from '../../helpers/common';
import { Eyeclose, Eyeopen } from '../../SvgFile/Index';

export default function Login() {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [loader, setloader] = useState(false);
  const [eye, setEye] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const navigate = useNavigate();

  const loginToApp = async (data) => {
    try {
      setloader(true);
      const response = await callAPIWithoutAuth(
        apiUrls.login,
        {},
        "POST",
        data
      );
      setloader(false);
      if (response.data.status) {
        let datas = response?.data?.data;
        localStorage.setItem("accessToken", datas?.token);
        localStorage.setItem("userData", JSON.stringify(datas));
        SuccessMessage(response.data.message);
        navigate("/admin/dashborad");
      } else {
        ErrorMessage(response.data.message);
      }
    } catch (e) {
      setloader(false);
      ErrorMessage(e.message);
    }
  };

  const handleChange = (e) => {
    setValue((val) => {
      return { ...val, [e.target.name]: e.target.value };
    });
  };

  const showPassword = () => {
    if (eye) setEye(false);
    else setEye(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      loginToApp(value);
    }
  };



  return (
    <>
      {loader && <ApiLoder />}
      <section className="sign_in p-0">
        <div className="container-fluid">
          <div className="row align-items-center h_100vh">
            <div className="col-lg-7 gradient_bg h_100vh">
              <div className="inner_content_two">
                <Link to="/admin/dashborad" className="logomain">
                  <img src="/image/original-logo.png" className="img-fluid" alt="" />
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row">
                <div className="col-lg-9 col-md-9 col-12 mx-auto">
                  <div className="inner_content_one">
                    <h1>Sign In</h1>
                    <h2>Welcome!</h2>
                    <form onSubmit={handleSubmit} className="form_sec mt-5">
                      <div className="row">
                        <div className="col-lg-12 mb-lg-4 mb-md-4 mb-3">
                          <InputFeild
                            type={"text"}
                            className={"form-control form-control-custom"}
                            name={"email"}
                            id={"email"}
                            placeholder={"abc12@gmail.com"}
                            value={value?.email}
                            handelChange={handleChange} labelclassName={"form-label form-label-custom"} label={"Email *"}
                          />

                          <div className="error">
                            {simpleValidator.current.message(
                              "email",
                              value?.email,
                              "required|email"
                            )}
                          </div>
                        </div>
                        <div className="col-lg-12 mb-5">
                          <div className="position-relative password_svg">

                            <InputFeild
                              type={eye ? "text" : "password"}
                              className={"form-control form-control-custom"}
                              name={"password"}
                              id={"password"}
                              placeholder={"********"}
                              value={value?.password}
                              handelChange={handleChange} labelclassName={"form-label form-label-custom"} label={"Password *"}
                            />



                            <div className="error">
                              {simpleValidator.current.message(
                                "password",
                                value?.password,
                                "required"
                              )}
                            </div>
                            <span onClick={showPassword}>
                              {eye ? <Eyeopen /> : <Eyeclose />}{" "}
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <Button disabled={loader} text={"Sign In"} className={"btnlogin w-100"} type={"submit"} />

                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
