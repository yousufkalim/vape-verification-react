import React, { FC, FormEvent, useLayoutEffect, useState } from 'react';
import api from '../../api/request';
import moment from 'moment';

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
import './Home.css';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { mediaUrl } from '../../config';

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
}

interface IBrand {
  name: string;
  id: string;
  logoWidth?: string;
  websiteLink?: string;
  preferences: {
    color?: string;
    logo?: string;
    secondaryColor?: string;
  };
}

// const status = 'valid';
const Home: FC = () => {
  const [code, setCode] = useState<string>('');
  const [codeStatus, setCodeStatus] = useState<string>('');
  const [alreadyScanDate, setAlreadyScaneDate] = useState<string>('');
  const [timestate, setTimeState] = useState<string>('');
  const [statusBg, setStatusBg] = useState<string>('');
  const [statusImage, setStatusImage] = useState<string>('');
  const [brand, setBrand] = useState<IBrand>({
    name: '',
    id: '',
    logoWidth: '',
    websiteLink: '',
    preferences: { color: '', logo: '' },
  });

  console.log('codeStatus', codeStatus);
  console.log('statusBg', statusBg);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  console.log('brand', brand);

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

  useLayoutEffect(() => {
    const { brandURL } = params;
    if (brandURL) {
      setLoading(true);
      api<IResponse>('get', `/users/brand/${brandURL}`)
        .then((res) => {
          setBrand(res.brand);
          setLoading(false);
        })
        .catch(() => {
          navigate('/');
          setLoading(false);
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value.length < 10) {
      if (
        (code.length === 3 && e.target.value.length === 4) ||
        (code.length === 4 && e.target.value.length === 5)
      ) {
        const splitCode = e.target.value.split('');
        splitCode.splice(4, 0, '-');
        const newCode = splitCode.join('');
        setCode(newCode);
      } else if (code.length === 6 && e.target.value.length === 5) {
        const splitCode = e.target.value.split('-')[0];
        setCode(splitCode);
      } else {
        setCode(e.target.value);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const body = {
      codeId: code,
      brandId: brand.id,
    };
    if (code !== '') {
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
          setCode('');
          setSubmitLoading(false);
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
              setTimeState(time);
              setAlreadyScaneDate(date);
            } else {
              setCodeStatus(`This code has already been scanned on`);
            }

            setStatusBg(UsedBg);
            setStatusImage(UsedImage);
          }
          if (status === 'invalid') {
            setCodeStatus(message);
            setStatusBg(InValidBg);
            setStatusImage(InValidImage);
          }
          setCode('');
          setSubmitLoading(false);
        });
    } else {
      toast.error('ERRO');
    }
  };

  const logo = brand?.preferences?.logo ? `${mediaUrl}/${brand.preferences?.logo}` : '';

  if (loading) {
    return (
      <div className="home_loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  } else {
    return (
      <div
        className="mainDiv1"
        style={{
          // background: `url(${logo})`,
          backgroundColor: brand?.preferences.color,
        }}
      >
        <div className="home_wrapper">
          <div className="home_logo">
            {brand?.preferences?.logo && (
              <>
                <a
                  href={brand?.websiteLink ? brand?.websiteLink : ''}
                  target="_blank"
                  rel="noreferrer"
                >
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
              </>
            )}
            {/* <div className="logo_title">{brand?.name}</div> */}
            {/* <img src={HomeLogo} alt="logo" /> */}
          </div>
          <div className="home_content">
            <div className="home_content_top">
              <div className="home_left">
                <div
                  className="heading_main"
                  // style={{
                  //   // background: `url(${logo})`,
                  //   color: brand?.preferences.secondaryColor,
                  // }}
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
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                  className="code_field"
                >
                  <div className="field_label">Enter Your Code</div>
                  <div>
                    <input
                      className="input_field"
                      placeholder="A1A1-A1A1"
                      type="text"
                      value={code}
                      onChange={handleChange}
                    />
                  </div>
                  <button disabled={!code || submitLoading} className="verify_btn">
                    {codeStatus ? 'Verify another code' : 'Verify'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <img src={logo} className="logoFixed" />
        </div>
        <div
          className="bottomDiv"
          style={{
            // background: `url(${logo})`,
            background: brand?.preferences.secondaryColor,
          }}
        >
          {/* <div className="responsePopup"> */}
          <div
            className={`${
              codeStatus === 'This code has already been scanned on'
                ? 'responsePopup'
                : 'invalidresponsePopup'
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
                        <div>
                          <span>{timestate}</span>
                          <span className="dateLine"></span>
                          <span>{alreadyScanDate}</span>
                        </div>
                      )}
                    </div>
                    {/* {alreadyScanDate && alreadyScanDate} */}
                    {codeStatus === 'This code is invalid.' && (
                      <div className="invalidcodeText">
                        Do not use product until verifying authenticity
                      </div>
                    )}
                  </div>
                </div>

                <div className="morinfoDiv">
                  <img src={Question} alt="Question" />
                  <a
                    href="https://getveriscan.com/docs/what-your-results-mean/#product-is-valid"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="moreInfospan"> More information</span>
                  </a>
                </div>
              </>
            )}
          </div>
          <div className="home_footer">
            © 2023{' '}
            <span>
              VeriScan
              {/* <a href="https://falconitconsultant.com" target="_blank" rel="noreferrer">
                  @Falcon Consulting
                </a> */}
            </span>
            , All Rights Reserved.
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
