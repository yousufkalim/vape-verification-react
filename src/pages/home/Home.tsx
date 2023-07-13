import React, { FC, useState, useLayoutEffect } from 'react';
import api from '../../api/request';
import Loading from '../../assets/loader.gif';

import './Home.css';
import Template4 from './Template4';
import Template3 from './Template3';
import Template2 from './Template2';
import Template1 from './Template1';

import { useParams } from 'react-router-dom';

interface IResponse {
  layout: string;
}

// const status = 'valid';
const Home: FC = () => {
  const params = useParams();
  const { brandURL } = params;
  // eslint-disable-next-line
  const [template, setTemplate] = useState<string>('4');
  // eslint-disable-next-line
  const [loading, setLoading] = useState<boolean>(true);
  useLayoutEffect(() => {
    if (brandURL) {
      setLoading(true);
      api<IResponse>('get', `/users/brand/${brandURL}`)
        .then((res) => {
          console.log('res layout', res.layout);
          setLoading(false);
          setTemplate(res?.layout);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []);
  const getLayout = (template: string): JSX.Element => {
    console.log('temp is', template);
    if (template === '1') {
      return <Template1 />;
    } else if (template === '2') {
      return <Template2 />;
    } else if (template === '3') {
      return <Template3 />;
    } else {
      return <Template4 />;
    }
  };

  if (loading) {
    return (
      <div className="home_loading">
        <img src={Loading} alt="loading" />
      </div>
    );
  } else {
    return <>{getLayout(template)}</>;
  }
};

export default Home;
