import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SubmitButton, { ErrorMessage, SuccessMessage } from '../../helpers/common'
import { useTranslation } from 'react-i18next'
import { callAPIWithoutAuth } from '../../../utils/apiUtils'
import { apiUrls } from '../../../utils/apiUrls'
import SimpleReactValidator from 'simple-react-validator'

const ForgotPassword = () => {
    const { t } = useTranslation()
    const [showPass, setShowPass] = useState(false)
    const [isOtp, setIsOtp] = useState(false)
    const simpleValidator = useRef(new SimpleReactValidator());
    const [, forceUpdate] = useState();
    const [otpValue, setOtpValue] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    const [loader, setloader] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [timer, setTimer] = useState(30);


    const [data, setData] = useState({
        email: '',
        new_password: '',
        confirm_password: ''
    })


    const handleChangeOtp = (index, event) => {
        const value = event?.target?.value;
        if (isNaN(value)) return;
        const newOtp = [...otpValue];
        newOtp[index] = value;
        setOtpValue(newOtp);
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };


    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        try {
            setloader(true);
            const response = await callAPIWithoutAuth(
                apiUrls.otpVerify,
                {},
                "POST",
                { email: data?.email, otp: otpValue.join(" ").replace(/\s/g, '') }
            );
            if (response.data.success) {
                SuccessMessage(response.data.message);
                setloader(false);
                setIsOtp(false)
                setShowPass(true)
            } else {
                ErrorMessage(response.data.message);
                setloader(false);
            }
        } catch (e) {
            setloader(false);
        }
    }

    const checkEmail = async (e) => {
        e.preventDefault()
        // if (!simpleValidator.current.fieldValid("email")) {
        //     simpleValidator.current.showMessageFor("email")
        //     forceUpdate(1)
        //     return
        // }
        try {
            setloader(true);
            const response = await callAPIWithoutAuth(
                apiUrls.forgotPassword,
                {},
                "POST",
                { email: data?.email }
            );
            if (response.data.success) {

                SuccessMessage(response.data.message);
                setloader(false)
                setTimer(30);
                setCanResend(false);
                setOtpValue(Array(6).fill(''));
                setIsOtp(true)
            } else {
                ErrorMessage(response.data.message);
                setIsOtp(false)
                setloader(false)
            }
        } catch (e) {
            setloader(false);
        }
    }

    useEffect(() => {
        let interval = null;
        if (isOtp && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [isOtp, timer]);


    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otpValue[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text');
        if (pastedText.length === 6 && /^\d+$/.test(pastedText)) {
            const newOtp = [...pastedText];
            setOtpValue(newOtp);
            inputRefs.current[6 - 1].focus();
        }
    };

    const savePassword = async (e) => {

        e.preventDefault()
        if (!simpleValidator.current.allValid()) {
            simpleValidator.current.showMessages()
            forceUpdate(1)
            return
        }

        try {
            setloader(true);
            const response = await callAPIWithoutAuth(
                apiUrls.resetPassword,
                {},
                "POST",
                data
            );
            if (response.data.success) {
                SuccessMessage(response.data.message);
                handleClose()
                setloader(false)
                setIsOtp(false)
                setShowPass(false)
                const modalElement = document.getElementById("forgotPasswordModal");

                if (modalElement) {
                    const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                    modalInstance.hide()
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            } else {
                ErrorMessage(response.data.message);
                setIsOtp(false)
                setloader(false)
            }
        } catch (e) {
            setloader(false);
        }
    }


    const handleClose = (e) => {

        const modalElement = document.getElementById("forgotPasswordModal");
        if (modalElement) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
            modalInstance.hide()
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }


        setData({ email: "", new_password: "", confirm_password: "" })
        setOtpValue(Array(6).fill(null))
        setIsOtp(false)
        setTimer(30)
        setCanResend(false)
        setShowPass(false)
    }
    
    return (
        
        <div
            className="modal fade"
            id="forgotPasswordModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
             {simpleValidator.current.purgeFields()}
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="row">
                            <button
                                type="button"
                                className="btn-login-close text-end"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={(e) => handleClose(e)}

                            >
                                <img src="/images/times-circle.svg" alt="" />
                            </button>
                            <div className="logim-form-sec">
                                {!showPass ? <h3 className="login-form-title mb-30 text-center">
                                    {!isOtp ? "Enter Email For Verification" : "Enter verification Code"}
                                </h3> : <h3 className="login-form-title mb-30 text-center">
                                    Enter New Password
                                </h3>}
                                <div className="login-form-fields-sec ">

                                    {!isOtp && !showPass && <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control custom-form-control"
                                            placeholder="Enter Email"
                                            onChange={(e) => setData((prev) => ({ ...prev, email: e?.target?.value }))}
                                        />
                                        {simpleValidator.current.message(
                                            `email`,
                                            data?.email,
                                            "required", { className: 'text-danger pb-2' }
                                        )}
                                    </div>}
                                    {isOtp && <>
                                        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', marginLeft: '119px' }}>
                                            {otpValue.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength={1}
                                                    style={{ width: '30px', height: '30px', textAlign: 'center' }}
                                                    onChange={(e) => handleChangeOtp(index, e)}
                                                    onKeyDown={(event) => handleKeyDown(index, event)}
                                                    onPaste={handlePaste}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    value={digit}
                                                    autoFocus={index === 0}
                                                />

                                            ))}

                                        </div>
                                        <SubmitButton name={t("Verify-OTP")} className="btn-theme-login green" disabled={loader} onClick={handleVerifyOtp} />
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            {canResend ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0"
                                                    style={{ color: '#28a745', textDecoration: 'underline', fontWeight: 500 }}
                                                >
                                                    {t("Resend OTP")}
                                                </button>
                                            ) : (
                                                <span style={{ color: '#888' }}>
                                                    {t("Resend OTP in")} {timer} {t("seconds")}
                                                </span>
                                            )}
                                        </div>

                                    </>}
                                    {showPass && <> <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control custom-form-control"
                                            placeholder="New Password"
                                            onChange={(e) => setData((prev) => ({ ...prev, new_password: e?.target?.value }))}
                                        />
                                        {simpleValidator.current.message(
                                            `new password`,
                                            data?.new_password,
                                            "required", { className: 'text-danger pb-2' }
                                        )}
                                    </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control custom-form-control"
                                                placeholder="Confirm Password"
                                                onChange={(e) => setData((prev) => ({ ...prev, confirm_password: e?.target?.value }))}
                                            />
                                            {simpleValidator.current.message(
                                                `confirem password`,
                                                data?.confirm_password,
                                                "required", { className: 'text-danger pb-2' }
                                            )}
                                        </div> </>}
                                    {!isOtp && !showPass &&

                                        <SubmitButton name={t("Verify Email")} className="btn-theme-login green" disabled={loader} onClick={checkEmail} />

                                    }
                                    {showPass &&

                                        <SubmitButton name={t("Save Password")} className="btn-theme-login green" disabled={loader} onClick={savePassword} />
                                    }



                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default ForgotPassword