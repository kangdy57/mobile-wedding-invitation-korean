import React, { useState } from 'react';
import data from '../assets/image_data.json';
import brideAccountData from '../assets/bride_account_number_data.json';
import pinIcon from '../assets/location-pin.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container as MapDiv, NaverMap, Marker, useNavermaps} from 'react-naver-maps';
import '../App.css';
import ImageModal from '../components/imageModal';
import AccountModal from '../components/accountModal';
//import mapImage from './map.jpg';
import mainImage from './main.png';
import nepalThumb from '../assets/nepal-thumb.jpg';
import nepalMain from '../assets/nepal.jpg';

function Bride() {
  // state for image modal
  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  // state for account modal
  const [ clickedAccountData, setClickedAccountData ] = useState(null);
  const [ copiedAccount, setCopiedAccount ] = useState(null);

    const navermaps = useNavermaps()

  const imageMap = {
  "nepal-thumb.jpg": nepalThumb,
  "nepal.jpg": nepalMain
};


  const handleClick = (item, index) => {
    setCurrentIndex(index);
    setClickedImg(imageMap[item.link]);
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
                <img src={mainImage} className='main-image' alt='t1'></img>
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
                    <strong>한국</strong>에서 태어난 <strong>다연</strong>과<br/>
                    <strong>네팔</strong>에서 태어난 <strong>프라노이</strong>가<br/>
                    <strong>독일</strong>에서 운명처럼 만나<br/>
                    한 가정을 이루게 되었습니다.<br/>
                    저희의 출발을 알리는 <strong>전통혼례식</strong>에<br/>
                    함께 해 주시면 감사하겠습니다.
              </div>
              <div className='invitation-section-text3'>
                강정배・진효정<span className='text3-inner'>의 딸</span> 강다연
              </div>
              <div className='invitation-section-text3'>
                람 물미・저너히타 물미<span className='text3-inner'>의 아들</span> 프라노이 물미 
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
                      <img className='gallery-image' src={imageMap[item.thumb_image_link]} alt={item.text} onClick={()=> handleClick(item, index)}/>
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
            <div className='location-map-section'>
              <MapDiv
                style={{
                  width: '100%',
                  height: '350px'
                }}
              >
                <NaverMap 
                  defaultCenter={new navermaps.LatLng(37.5909615011864, 127.04363162642107)}
                  defaultZoom={16}>
                  <Marker 
                  position={new navermaps.LatLng(37.5909615011864, 127.04363162642107)} 
                  icon={
                    {
                      url : pinIcon,
                      size : new navermaps.Size(64,64)
                    }
                  }/>
                </NaverMap>
              </MapDiv>
            </div>
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
                <li>6호선 고려대역 3번 출구 <br/> (도보 10분 or 15분 간격 셔틀버스 운영)</li>
                <li>지선버스 1226; 간선버스 201, 273 <br/> (세종대왕기념관 정류장 하차)</li>
              </ol>
            </div>
            <div className='location-how2-section'>
              <div className='location-how2-section-text1'>자가용</div>
              <div className='location-how2-section-text2'>
                네비게이션에 “세종대왕기념관”을 입력하세요. <br/>
                (주차 무료)
              </div>
            </div>
            <div className='general-info-section'>
                <div className='general-info-section-text1'>안내 드립니다</div>
                <div className='general-info-section-text2'>
                    <br/>본 예식에는 외국인 하객분들도 다수 참석할 예정입니다.<br/><br/>
                    한국의 아름다움을 직접 느끼고자 많은 분들께서 한복을 입고 참석하실 예정이오니,
                    평소 소장하고 계시던 한복이 있으시다면 부담없이 착용해 주셔도 좋겠습니다.<br/><br/>
                    물론 한복이 아니어도 전혀 무방하오니, 편안한 마음으로 참석해 주시면 감사하겠습니다.<br/>
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
      <div className="footer">
        컴퓨터공학을 전공하고 개발자로 일하는<br/> 
  신랑·신부가 직접 만든 청첩장입니다 <br/> 
  © 2025 Prannoy & Dayeon
</div>
    </div>
    
  );
}

export default Bride;
