import React, { FC, FormEvent, useLayoutEffect, useState, useEffect } from 'react';
import api from '../../api/request';
import moment from 'moment';
import { Zoom, Fade } from 'react-reveal';
import { motion } from 'framer-motion';
// import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
// import { styled } from '@mui/material/styles';

/*    Assets    */
// import HomeLogo from '../../assets/home/logo.svg';
import ValidBg from '../../assets/home/valid_bg.svg';
import ValidImg from '../../assets/home/valid.svg';
import Question from '../../assets/home/question.svg';
import Question1 from '../../assets/home/q1.svg';
import InValidBg from '../../assets/home/invalid_bg.svg';
import InValidImage from '../../assets/home/invalid.svg';
import UsedBg from '../../assets/home/used_bg.svg';
import UsedImage from '../../assets/home/used.svg';
import Loading from '../../assets/loader.gif';
import { ReactComponent as Facebook } from '../../assets/Facebook.svg';
import { ReactComponent as Twitter } from '../../assets/Twitter.svg';
import { ReactComponent as YouTube } from '../../assets/YouTube.svg';
import { ReactComponent as Instagram } from '../../assets/Instagram.svg';
import { ReactComponent as LinkedIn } from '../../assets/LinkedIn.svg';
import { ReactComponent as Reddit } from '../../assets/Reddit.svg';
import { ReactComponent as Snapchat } from '../../assets/Snapchat.svg';
import { ReactComponent as Telegram } from '../../assets/Telegram.svg';
import './Home.css';
import './Template3.css';
import './Template1.css';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { mediaUrl } from '../../config';
import Stepper from './StepperFun';
interface IBody {
  codeId?: string;
  message?: string;
  status?: string;
  validationTime?: string;
  success?: boolean;
}
// interface IResponse {
//   message: string;
//   status: string;
//   success: boolean;
// }

interface IResponse {
  brand: IBrand;
  feedbackForm: IfeedbackForm;
}
interface customizeButton {
  btnType: string;
  radius?: string;
  fontName?: string;
  fontWeight?: string;
  fontSize?: string;
  bgColor: string;
  border?: string;
  color?: string;
}
interface background {
  img?: string;
  selectedImg: string;
  type: string;
  color?: string;
}
interface IBrand {
  id: string;
  name: string;
  logo?: string;
  preferences?: {
    logo?: string;
    color?: string;
    secondaryColor?: string;
  };
  textTypography?: any;
  background: background;
  logoWidth?: string;
  websiteLink?: string;
  url?: string;
  favIcon?: string;
  favIcons?: [];
  socialMedia?: [];
  customizeButton?: customizeButton;
  description?: string;
  pageAnimation?: string;
  socialMediaColor?: string;
}
interface IfeedbackForm {
  _id: string;
  brand: string;
  filedLabel: string;
  filedPlaceholder: string;
  filedRequired: boolean;
  filedActive: boolean;
  isActive: boolean;
}
// const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: 'rgba(0, 0, 0, 0.87)',
//     boxShadow: theme.shadows[1],
//     fontSize: 11,
//   },
// }));

// const status = 'valid';
const Template1: FC = () => {
  const [code, setCode] = useState<string>('');
  const [codeStatus, setCodeStatus] = useState<string>('');
  const [alreadyScanDate, setAlreadyScaneDate] = useState<string>('');
  const [timestate, setTimeState] = useState<string>('');
  const [statusBg, setStatusBg] = useState<string>('');
  const [statusImage, setStatusImage] = useState<string>('');
  const [feedbackForms, setFeedbackForms] = useState<IfeedbackForm[] | any>([]);
  const currentYear = new Date().getFullYear();
  // eslint-disable-next-line
  const [feedbacks, setFeedbacks] = useState<any>([]);
  const [brand, setBrand] = useState<IBrand>({
    name: '',
    id: '',
    logoWidth: '',
    websiteLink: '',
    logo: '',
    preferences: { color: '', logo: '' },
    textTypography: null,
    background: {
      img: '',
      selectedImg: '',
      type: '',
      color: '',
    },
    url: '',
    favIcon: '',
    socialMedia: [],
    socialMediaColor: '',
    customizeButton: {
      btnType: '',
      radius: '',
      bgColor: '',
    },
    description: '',
  });

  // console.log('codeStatus', codeStatus);
  console.log('brand', brand);
  console.log('statusBg', statusBg);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  console.log('submittedCode', submittedCode);
  // eslint-disable-next-line
  const [activeStep, setActiveStep] = useState<number>(0);
  // eslint-disable-next-line

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (status === 'valid') {
  //     setCodeStatus('valid');
  //     setStatusBg(ValidBg);
  //     setStatusImage(ValidImg);
  //   } else if (status === 'used') {
  //     setCodeStatus('used');
  //     setStatusBg(UsedBg);
  //     setStatusImage(UsedImage);
  //   } else {
  //     setCodeStatus('invalid');
  //     setStatusBg(InValidBg);
  //     setStatusImage(InValidImage);
  //   }
  // }, []);
  const params = useParams();
  const { brandURL, brandcode } = params;

  useLayoutEffect(() => {
    if (brandURL) {
      setLoading(true);
      api<IResponse>('get', `/users/brand/${brandURL}`)
        .then((res: any) => {
          // console.log('res braand', res.brand);
          setLoading(false);
          setBrand(res.brand);
          const activeFeedback = res?.feedbackForm?.filter((form: IfeedbackForm) => form.isActive);
          setFeedbackForms(activeFeedback);
        })
        .catch(() => {
          navigate('/');
          setLoading(false);
        });
    }
  }, []);
  useEffect(() => {
    if (brandcode && brand.id) {
      verifyBrandCode(brandcode, 'nfc');
    }
  }, [brand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.toUpperCase();
    if (value.length < 12) {
      if ((code.length === 4 && value.length === 5) || (code.length === 5 && value.length === 6)) {
        const splitCode = value.split('');
        splitCode.splice(5, 0, '-');
        const newCode = splitCode.join('');
        setCode(newCode);
      } else if (code.length === 7 && value.length === 6) {
        const splitCode = value.split('-')[0];
        setCode(splitCode);
      } else {
        setCode(value);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (feedbackForms?.length !== 0 && activeStep === 0) {
      // eslint-disable-next-line
      setActiveStep(1);
    } else if (feedbackForms?.length !== 0 && activeStep === 2) {
      setActiveStep(0);
    } else {
      verifyBrandCode(code, 'regular');
    }
  };
  const verifyBrandCode = (bCode: string, codeType: string): void => {
    const allFields = feedbackForms?.map((item: any) => ({
      name: item.label,
      value: item.value,
    }));
    const body = {
      codeId: bCode,
      brandId: brand.id,
      code_type: codeType,
      feedbacks: allFields,
    };
    if (bCode !== '') {
      setSubmitLoading(true);
      api<IBody>('post', '/codes/validate', body)
        .then((res) => {
          if (res.status === 'valid') {
            if (res?.message) {
              setCodeStatus(res.message);
            }
            setStatusBg(ValidBg);
            setStatusImage(ValidImg);
          }
          const feedbackIs = feedbackForms?.map((feedbackForm: any): any => {
            return { ...feedbackForm, value: '' };
          });
          setFeedbackForms(feedbackIs);
          setSubmittedCode(code);
          setCode('');
          setSubmitLoading(false);
          if (feedbackForms.length !== 0) {
            setActiveStep(2);
          }
        })
        .catch((err) => {
          const { status, message, validationTime } = err.response.data;
          if (status === 'used') {
            if (validationTime) {
              // const date = moment(validationTime).format('h:mm A DD-MMM-YYYY ');
              const date = moment(validationTime).format('DD-MMM-YYYY ');
              const time = moment(validationTime).format('h:mm A');
              // const formatedDate = moment(validationTime, 'M/D/YYYY h:mmA');
              setCodeStatus(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions

                // `This code has already been scanned on ${new Date(validationTime as string)}`,
                `This code has already been scanned on`,
              );
              const feedbackIs = feedbackForms?.map((feedbackForm: any): any => {
                return { ...feedbackForm, value: '' };
              });
              setFeedbackForms(feedbackIs);
              setTimeState(time);
              setAlreadyScaneDate(date);
            } else {
              setCodeStatus(`This code has already been scanned on`);
            }

            setStatusBg(UsedBg);
            setStatusImage(UsedImage);
          }
          if (status === 'invalid') {
            const feedbackIs = feedbackForms?.map((feedbackForm: any): any => {
              return { ...feedbackForm, value: '' };
            });
            setFeedbackForms(feedbackIs);
            setCodeStatus(message);
            setStatusBg(InValidBg);
            setStatusImage(InValidImage);
          }
          if (status === 'invalidType') {
            const feedbackIs = feedbackForms?.map((feedbackForm: any): any => {
              return { ...feedbackForm, value: '' };
            });
            setFeedbackForms(feedbackIs);
            setCodeStatus('The code type is invalid, it should be NFC code.');
            setStatusBg(InValidBg);
            setStatusImage(InValidImage);
          }
          setSubmittedCode(code);
          setCode('');
          setSubmitLoading(false);
          if (feedbackForms.length !== 0) {
            setActiveStep(2);
          }
        });
    } else {
      toast.error('ERRO');
    }
  };

  const logo = brand?.logo ? `${mediaUrl}/${brand?.logo}` : '';

  // const socialIcon = (icon: string): string => {
  //   if (icon === 'telegram') {
  //     return Telegram;
  //   } else if (icon === 'linkedIn') {
  //     return LinkedIn;
  //   } else if (icon === 'twitter') {
  //     return Twitter;
  //   } else if (icon === 'facebook') {
  //     return Facebook;
  //   } else if (icon === 'reddit') {
  //     return Reddit;
  //   } else if (icon === 'snapchat') {
  //     return Snapchat;
  //   } else if (icon === 'instagram') {
  //     return Instagram;
  //   } else {
  //     return YouTube;
  //   }
  // };
  const socialIcon = (icon: string): JSX.Element => {
    if (icon === 'telegram') {
      return (
        <Telegram
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'linkedIn') {
      return (
        <LinkedIn
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'twitter') {
      return (
        <Twitter
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'facebook') {
      return (
        <Facebook
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'reddit') {
      return (
        <Reddit
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'snapchat') {
      return (
        <Snapchat
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else if (icon === 'instagram') {
      return (
        <Instagram
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    } else {
      return (
        <YouTube
          style={{
            background: brand?.socialMediaColor,
          }}
        />
      );
    }
  };
  useEffect((): void => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

    if (brand?.favIcon) {
      const favIs = `${mediaUrl}/${brand?.favIcon}`;
      console.log('favIs for uodatetion', favIs);
      favicon.href = favIs;
    }
  }, [brand]);

  useEffect(() => {
    const pageTitle = document.querySelector('title') as HTMLElement;

    if (brand?.name) {
      pageTitle.innerText = brand?.name;
    }
  }, [brand]);

  // eslint-disable-next-line
  const Selectedimg = brand?.background?.selectedImg
    ? `${mediaUrl}/${brand?.background?.selectedImg}`
    : '';
  const uploadedImg = brand?.background?.img ? `${mediaUrl}/${brand?.background?.img}` : '';

  const handleChangeinput = (e: React.ChangeEvent<HTMLInputElement>, i: any, field: any): any => {
    const feedbackIs = feedbackForms?.map((feedbackForm: any, ind: any): any => {
      if (ind === i) {
        return { ...feedbackForm, value: e.target.value, name: field };
      } else {
        return { ...feedbackForm };
      }
    });
    setFeedbackForms(feedbackIs);

    // setFeedbackForms(updatedForm);
  };
  const websiteLink =
    brand?.websiteLink && !brand.websiteLink.startsWith('http')
      ? `https://${brand.websiteLink}`
      : brand.websiteLink;

  if (loading) {
    return (
      <div className="home_loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  } else {
    return (
      <div
        className={`mainDiv1`}
        style={{
          backgroundColor:
            brand?.background?.type === 'color'
              ? brand?.background.color
              : brand?.background?.type === 'default'
              ? brand?.preferences?.secondaryColor
              : '',
        }}
      >
        {brand?.background?.type === 'default' && (
          <div className="defaultBgContainer">
            <div
              className="defaultBgUpperDiv"
              style={{
                background: brand?.background?.type === 'default' ? brand?.preferences?.color : '',
              }}
            />
          </div>
        )}
        {brand?.background?.type === 'Selected' ? (
          <img src={Selectedimg} alt="Background Image" className="backgroundImg" />
        ) : (
          <img
            src={Selectedimg}
            className="backgroundImg"
            alt="Background Image"
            style={{ display: 'none' }}
          />
        )}
        {brand?.background?.type === 'img' ? (
          <img src={uploadedImg} alt="Background Image" className="backgroundImg" />
        ) : (
          <img
            src={uploadedImg}
            className="backgroundImg"
            alt="Background Image"
            style={{ display: 'none' }}
          />
        )}

        <motion.div
          initial={{
            x: brand.pageAnimation === 'moveIn' ? -300 : 0,
            y: brand.pageAnimation === 'bottom' ? 400 : 0,
            opacity:
              brand.pageAnimation === 'moveIn' ||
              brand.pageAnimation === 'bottom' ||
              brand.pageAnimation === 'zoomIn'
                ? 0.8
                : 1,
            scale: brand.pageAnimation === 'zoomIn' ? 0.6 : 1,
          }}
          whileInView={{ x: 0, opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="home_wrapper"
        >
          <div className="home_logo">
            {brand?.logo && (
              <>
                {/* <LightTooltip title={brand?.description ? brand?.description : ''}> */}
                <a href={websiteLink} target="_blank" rel="noreferrer">
                  <img
                    className="brand_logo1"
                    style={{
                      // width: '20%',
                      // background: `url(${logo})`,
                      width: `${brand?.logoWidth ? brand?.logoWidth + 'px' : '200px'}`,
                    }}
                    src={logo}
                  />
                </a>
                {/* </LightTooltip> */}
                {brand?.description?.length && (
                  <div className="home_Desp">
                    <p>{brand?.description ? brand?.description : ''}</p>
                  </div>
                )}
              </>
            )}
            {/* <div className="logo_title">{brand?.name}</div> */}
            {/* <img src={HomeLogo} alt="logo" /> */}
          </div>
          {!brandcode && (
            <div className="home_content">
              <div className="home_content_top">
                <div className="home_left">
                  <div
                    className="heading_main main_heading_two"
                    style={{
                      fontSize: brand?.textTypography?.Heading?.fontSize
                        ? brand?.textTypography?.Heading?.fontSize
                        : '2.4rem',
                      fontFamily: brand?.textTypography?.Heading?.fontName
                        ? brand?.textTypography?.Heading?.fontName
                        : 'Poppins',
                      fontWeight: brand?.textTypography?.Heading?.fontWeight
                        ? brand?.textTypography?.Heading?.fontWeight
                        : 600,
                      // color: brand?.preferences.secondaryColor,
                    }}
                  >
                    Verify your product
                    <a
                      href="https://getveriscan.com/docs/how-to-enter-your-products-code/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <img src={Question1} alt="Question" className="questionimg1" />
                    </a>
                  </div>
                  {/* Stepper Here */}
                  {feedbackForms?.length !== 0 && <Stepper activeStep={activeStep} />}

                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                    className="code_field"
                  >
                    {activeStep === 0 && (
                      <>
                        <div
                          style={{
                            fontSize: brand?.textTypography?.Paragraph?.fontSize
                              ? brand?.textTypography?.Paragraph?.fontSize
                              : '1.4rem',
                            fontFamily: brand?.textTypography?.Paragraph?.fontName
                              ? brand?.textTypography?.Paragraph?.fontName
                              : 'Poppins',
                            fontWeight: brand?.textTypography?.Paragraph?.fontWeight
                              ? brand?.textTypography?.Paragraph?.fontWeight
                              : '100',
                            // color: brand?.preferences.secondaryColor,
                          }}
                        >
                          Enter Your Code
                        </div>
                        <div>
                          <input
                            className="input_field input_field_four"
                            placeholder="A1A1A-A1A1A"
                            type="text"
                            value={code}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    )}
                    {activeStep === 1 &&
                      feedbackForms.length !== 0 &&
                      feedbackForms.map((form: any, i: any) => (
                        <>
                          {form.isActive && (
                            <>
                              {' '}
                              <div
                                style={{
                                  fontSize: brand?.textTypography?.Paragraph?.fontSize
                                    ? brand?.textTypography?.Paragraph?.fontSize
                                    : '1.4rem',
                                  fontFamily: brand?.textTypography?.Paragraph?.fontName
                                    ? brand?.textTypography?.Paragraph?.fontName
                                    : 'Poppins',
                                  fontWeight: brand?.textTypography?.Paragraph?.fontWeight
                                    ? brand?.textTypography?.Paragraph?.fontWeight
                                    : '100',
                                  // color: brand?.preferences.secondaryColor,
                                }}
                              >
                                {form.label}
                              </div>
                              <div>
                                <input
                                  className="input_field input_field_four"
                                  placeholder={form.placeholder}
                                  type="text"
                                  value={form.value}
                                  onChange={(e): void => {
                                    handleChangeinput(e, i, form.label);
                                  }}
                                  required={form.isRequired}
                                />
                              </div>
                            </>
                          )}
                        </>
                      ))}
                    <button
                      disabled={(!code && activeStep !== 2) || submitLoading}
                      className="verify_btn verify_btn_two"
                      style={{
                        background:
                          brand?.customizeButton?.btnType === 'outline'
                            ? 'transparent'
                            : brand?.customizeButton?.bgColor
                            ? brand?.customizeButton?.bgColor
                            : '#236fda',
                        color: brand?.customizeButton?.btnType === 'outline' ? 'black' : 'white',
                        fontFamily: brand?.customizeButton?.fontName
                          ? brand?.customizeButton?.fontName
                          : 'Poppins',
                        fontWeight: brand?.customizeButton?.fontWeight
                          ? brand?.customizeButton?.fontWeight
                          : 500,
                        fontSize: brand?.customizeButton?.fontSize
                          ? brand?.customizeButton?.fontSize
                          : '1.8rem',
                        borderRadius: brand?.customizeButton?.radius
                          ? brand?.customizeButton?.radius
                          : '1rem',
                        border:
                          brand?.customizeButton?.btnType === 'outline'
                            ? `1px solid ${brand?.customizeButton?.bgColor}`
                            : '',
                      }}
                    >
                      {codeStatus ? (activeStep === 2 ? 'Back' : 'Check Verification') : 'Verify'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          <div className="animatedPopUp2">
            {brand.pageAnimation === 'moveIn' ? (
              <Fade spy={submittedCode} left style={{ width: '100%' }}>
                <div
                  className={`${
                    !brandcode
                      ? codeStatus === 'This code has already been scanned on'
                        ? 'responsePopup'
                        : 'invalidresponsePopup'
                      : 'withBrandCode1'
                  }`}
                >
                  {codeStatus && (
                    <>
                      <div className="home_status">
                        <div style={{ width: '10%' }}>
                          {/* <span> */}
                          <img style={{ width: '100%' }} src={statusImage} alt="statusImage" />
                          {/* </span> */}
                        </div>
                        <div
                          className={`${
                            codeStatus === 'This code has already been scanned on'
                              ? 'statusScanned'
                              : 'status'
                          }`}
                        >
                          {codeStatus}
                          <div className="ScanedDate">
                            {codeStatus === 'This code has already been scanned on' && (
                              <div className="Scaned_date_main_div">
                                <div style={{ width: 'fit-content', whiteSpace: 'nowrap' }}>
                                  <span>{timestate}</span>
                                  <span className="dateLine"></span>
                                  <span>{alreadyScanDate}</span>
                                </div>
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}

                            {codeStatus === 'This product is valid.' && (
                              <div className="Scaned_date_main_div">
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* {alreadyScanDate && alreadyScanDate} */}
                          {codeStatus === 'This code is invalid.' && (
                            <div className="invalidcodeText">
                              <p>Do not use product until verifying authenticity</p>
                              <div className="morinfoDiv">
                                <img src={Question} alt="Question" />
                                <a
                                  href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                  rel="noreferrer"
                                  target="_blank"
                                ></a>
                                <div className="moreInfospan"> More information</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Fade>
            ) : brand.pageAnimation === 'zoomIn' ? (
              <Zoom spy={submittedCode} style={{ width: '100%' }}>
                <div
                  className={`${
                    !brandcode
                      ? codeStatus === 'This code has already been scanned on'
                        ? 'responsePopup'
                        : 'invalidresponsePopup'
                      : 'withBrandCode1'
                  }`}
                >
                  {codeStatus && (
                    <>
                      <div className="home_status">
                        <div>
                          <span>
                            <img src={statusImage} alt="statusImage" />
                          </span>{' '}
                        </div>
                        <div
                          className={`${
                            codeStatus === 'This code has already been scanned on'
                              ? 'statusScanned'
                              : 'status'
                          }`}
                        >
                          {codeStatus}
                          <div className="ScanedDate">
                            {codeStatus === 'This code has already been scanned on' && (
                              <div className="Scaned_date_main_div">
                                <span>{timestate}</span>
                                <span className="dateLine"></span>
                                <span>{alreadyScanDate}</span>
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}

                            {codeStatus === 'This product is valid.' && (
                              <div className="Scaned_date_main_div">
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* {alreadyScanDate && alreadyScanDate} */}
                          {codeStatus === 'This code is invalid.' && (
                            <div className="invalidcodeText">
                              Do not use product until verifying authenticity
                              <div className="morinfoDiv">
                                <img src={Question} alt="Question" />
                                <a
                                  href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                  rel="noreferrer"
                                  target="_blank"
                                ></a>
                                <div className="moreInfospan"> More information</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Zoom>
            ) : brand.pageAnimation === 'bottom' ? (
              <Zoom bottom spy={submittedCode} style={{ width: '100%' }}>
                <div
                  className={`${
                    !brandcode
                      ? codeStatus === 'This code has already been scanned on'
                        ? 'responsePopup'
                        : 'invalidresponsePopup'
                      : 'withBrandCode1'
                  }`}
                >
                  {codeStatus && (
                    <>
                      <div className="home_status">
                        <div>
                          <span>
                            <img src={statusImage} alt="statusImage" />
                          </span>{' '}
                        </div>
                        <div
                          className={`${
                            codeStatus === 'This code has already been scanned on'
                              ? 'statusScanned'
                              : 'status'
                          }`}
                        >
                          {codeStatus}
                          <div className="ScanedDate">
                            {codeStatus === 'This code has already been scanned on' && (
                              <div className="Scaned_date_main_div">
                                <span>{timestate}</span>
                                <span className="dateLine"></span>
                                <span>{alreadyScanDate}</span>
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}

                            {codeStatus === 'This product is valid.' && (
                              <div className="Scaned_date_main_div">
                                <div className="morinfoDiv">
                                  <img src={Question} alt="Question" />
                                  <a
                                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                    rel="noreferrer"
                                    target="_blank"
                                  ></a>
                                  <div className="moreInfospan"> More information</div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* {alreadyScanDate && alreadyScanDate} */}
                          {codeStatus === 'This code is invalid.' && (
                            <div className="invalidcodeText">
                              Do not use product until verifying authenticity
                              <div className="morinfoDiv">
                                <img src={Question} alt="Question" />
                                <a
                                  href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                  rel="noreferrer"
                                  target="_blank"
                                ></a>
                                <div className="moreInfospan"> More information</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Zoom>
            ) : (
              <div
                className={`${
                  !brandcode
                    ? codeStatus === 'This code has already been scanned on'
                      ? 'responsePopup'
                      : 'invalidresponsePopup'
                    : 'withBrandCode1'
                }`}
              >
                {codeStatus && (
                  <>
                    <div className="home_status">
                      <div>
                        <span>
                          <img src={statusImage} alt="statusImage" />
                        </span>{' '}
                      </div>
                      <div
                        className={`${
                          codeStatus === 'This code has already been scanned on'
                            ? 'statusScanned'
                            : 'status'
                        }`}
                      >
                        {codeStatus}
                        <div className="ScanedDate">
                          {codeStatus === 'This code has already been scanned on' && (
                            <div className="Scaned_date_main_div">
                              <span>{timestate}</span>
                              <span className="dateLine"></span>
                              <span>{alreadyScanDate}</span>
                              <div className="morinfoDiv already_scaned">
                                <img src={Question} alt="Question" />
                                <a
                                  href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                  rel="noreferrer"
                                  target="_blank"
                                ></a>
                                <div className="moreInfospan "> More information</div>
                              </div>
                            </div>
                          )}

                          {codeStatus === 'This product is valid.' && (
                            <div className="Scaned_date_main_div">
                              <div className="morinfoDiv">
                                <img src={Question} alt="Question" />
                                <a
                                  href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                  rel="noreferrer"
                                  target="_blank"
                                ></a>
                                <div className="moreInfospan"> More information</div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* {alreadyScanDate && alreadyScanDate} */}
                        {codeStatus === 'This code is invalid.' && (
                          <div className="invalidcodeText">
                            Do not use product until verifying authenticity
                            <div className="morinfoDiv">
                              <img src={Question} alt="Question" />
                              <a
                                href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                                rel="noreferrer"
                                target="_blank"
                              ></a>
                              <div className="moreInfospan"> More information</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* <div className="background_img_logo">
          <img src={logo} className="logoFixed" />
        </div> */}
        <div
          className="bottomDiv"
          style={
            {
              // background:
              //   brand?.background?.type === 'default' ? brand?.preferences?.secondaryColor : '',
            }
          }
        >
          {/* <div className="responsePopup"> */}

          <div className="socialIconDiv">
            {brand?.socialMedia?.length !== 0 &&
              brand?.socialMedia?.map((social: any) => (
                <>
                  {/* <a href={social.link} target="_blank" rel="noreferrer">
                    <img src={socialIcon(social?.platform)} className="socialIcon" />
                  </a> */}
                  <a href={social.link} target="_blank" rel="noreferrer">
                    {socialIcon(social?.platform)}
                  </a>
                </>
              ))}
          </div>
          <div className="home_footer" style={{ color: brand?.socialMediaColor }}>
            © {currentYear}{' '}
            <span>
              <a href="https://getveriscan.com" target="_blank" rel="noreferrer">
                VeriScan
              </a>
            </span>
            , All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }
};

export default Template1;
