import React, { FC } from 'react';
import notFound from '../../assets/home/404.svg';
import notFoundB from '../../assets/home/404b.svg';
import './NotFound.css';

const NotFound: FC = () => {
  return (
    <>
      <div className="notFoundRow">
        <div className="NotFoundDiv1">
          <div className="notFoundBox1">
            <div className="title1">
              <img src={notFound} className="notfoundImg" alt="notFoundB" />
            </div>
            <div className="title2">Ooops!</div>
            <div className="title3">Page Not Found</div>
            <div className="title4">
              This page doesn’t exist or was removed We suggest you please enter brand name in URL
            </div>

            <div>
              <img src={notFoundB} className="notfoundImg" alt="notFoundB" />
            </div>
          </div>
        </div>
        <div className="NotFoundDiv2">
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
    </>
  );
};

export default NotFound;
