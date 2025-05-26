import React, { useState } from 'react';
import data from '../assets/image_data.json';
import brideAccountData from '../assets/bride_account_number_data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import ImageModal from '../components/imageModal';
import AccountModal from '../components/accountModal';
import mapImage from './map.jpg';

function Bride() {
  // state for image modal
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  // state for account modal
  const [ clickedAccountData, setClickedAccountData ] = useState(null);
  const [ copiedAccount, setCopiedAccount ] = useState(null);

  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(item.link);
  };
  const accountClick = (account_data) => {
    setClickedAccountData(account_data.data);
  };

  const handleRotationRight = () => {
    const totalLength = data.data.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = data.data[0].link;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
      });
    const newItem = newUrl[0].link;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };
  
  const handleRotationLeft = () => {
    const totalLength = data.data.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = data.data[totalLength-1].link;
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = data.data.filter((item) => {
      return data.data.indexOf(item) === newIndex;
      });
    const newItem = newUrl[0].link;
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="">
      <div className='main container'>
        <div className="row justify-content-md-center">
          <div className="col col-md-2 col-lg-3">
          </div>

          <div className="col-md">
            <div className='mainsection'>
              <div>
                <img src="https://dave-khim-aws-bucket-public.s3.ap-northeast-2.amazonaws.com/test/love-tenderness-couple-s-crossed-hands.jpg" className='main-image' alt='t1'></img>
              </div>
              <div className='mainsection-text'>
                <div className='mainsection-text-1'>저희 결혼합니다</div>
                <div className='mainsection-text-2'>
                  강다연 <span className='text2-inner'> & </span> 프라노이 물미
                </div>
                <div className='mainsection-text-3'>2026. 10. 24 토요일 15시<br/>세종대왕기념관</div>
              </div>
            </div>
            <div className='invitation-section'>
              <div className='invitation-section-text1'>INVITATION</div>
              <div className='invitation-section-text2'>
                    한국에서 태어난 다연과<br/>
                    네팔에서 태어난 프라노이가<br/>
                    독일에서 운명처럼 만나<br/>
                    한 가정을 이루게 되었습니다.<br/>
                    저희의 출발을 알리는 예식에<br/>
                    귀한 걸음 부탁드립니다.
              </div>
              <div className='invitation-section-text3'>
                강정배・진효정<span className='text3-inner'>의 딸</span> 강다연
              </div>
              <div className='invitation-section-text3'>
                람 물미・저너히타 물미<span className='text3-inner'>의 아들</span> 프라노이 물미 
              </div>
    <br/>
    <br/>
                <div className='invitation-section-text3'>
                Jungbae Kang・Hyojung Jin<span className='text3-inner'>'s Daughter</span> Dayeon Kang
              </div>
              <div className='invitation-section-text3'>
                Ram Mulmi・Janahita Mulmi<span className='text3-inner'>'s Son</span> Prannoy Mulmi
              </div>
            </div>
            <div className='gallery-section'>
              <div className='gallery-section-text'>
                GALLERY
              </div>
            </div>
            <div>
              <div className='gallery-image-list-wrapper row'>
                  {data.data.map((item, index) => (
                    <div key={index} className='col-4'>
                      <img className='gallery-image' src={item.thumb_image_link} alt={item.text} onClick={()=> handleClick(item, index)}/>
                    </div>
                  ))}
              </div>
              {clickedImg && <ImageModal 
              clickedImg={clickedImg}
              handleRotationRight={handleRotationRight}
              handleRotationLeft={handleRotationLeft}
              setClickedImg={setClickedImg}
              />}
            </div>
            <div className='location-section'>
              <div className='location-section-text1'>
                LOCATION
              </div>
            </div>

            <img src={mapImage} alt="Map" className="location-map" />

            <div className='location-info-section'>
                <div className='location-info-section-text1'>세종대왕기념관</div>
                <div className='location-info-section-text2'>
                    서울 동대문구 회기로 56<br/>
                    Tel. 02-960-1700
                </div>
            </div>
            <div className='location-how-publictrans-section'>
              <div className='location-how-publictrans-section-text1'>대중교통</div>
              <ol className='location-how-publictrans-section-list'>
                <li>6호선 고려대역 3번 출구 (도보 10분 or 15분 간격 셔틀버스 운영)</li>

              </ol>
            </div>
            <div className='location-how2-section'>
              <div className='location-how2-section-text1'>자가용</div>
              <div className='location-how2-section-text2'>
                네비게이션 이용 시 “세종대왕기념관”을 입력하세요. (주차 무료)
              </div>
            </div>
            <div className='congratulatory-section'>
              <div className='congratulatory-section-text'>마음 전하실 곳</div>
                <div 
                  className='congratulatory-section-btn'
                  onClick={() => accountClick(brideAccountData)}>신부 측 계좌번호</div>
            </div>
            {clickedAccountData && <AccountModal 
              clickedAccountData={clickedAccountData}
              setClickedAccountData={setClickedAccountData}
              copiedAccount={copiedAccount}
              setCopiedAccount={setCopiedAccount}
              />}
          </div>

          <div className="col col-md-2 col-lg-3">
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Bride;
