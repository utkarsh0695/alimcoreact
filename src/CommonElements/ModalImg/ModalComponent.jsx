import React, { useEffect } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import Slider from "react-slick";
function ModalComponent({ isOpen, toggleModal, titleName, images, currentImageIndex, handleRemoveImage, fileType }) {
  const settings = {
    focusOnSelect: true,
    centerMode: true,
    focusOnSelect: true,
    // infinite: true,
    slidesToShow: 1,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block"}}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block"}}
        onClick={onClick}
      />
    );
  }

  // Function to handle keyboard navigation
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.keyCode === 37) {
  //       document.querySelector('.slick-prev').click();
  //     } else if (event.keyCode === 39) {
  //       document.querySelector('.slick-next').click();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);




  const handleRemoveImages = (index) => {
    handleRemoveImage(index);
    if (index === 0) {
      toggleModal();
    }
  };
  return (

    <div>

      <Modal isOpen={isOpen} toggle={toggleModal} size='lg'>
        <ModalHeader toggle={toggleModal}>{titleName}</ModalHeader>
        <hr />
        <ModalBody>
          <Slider {...settings}>
            {

              images?.length > 1 ?
                images?.map((image, index) => (
                  <div key={index}>
                    {/* {handleRemoveImage ? <span onClick={() => handleRemoveImages(index)} style={{ cursor: 'pointer' }}>x</span> : null} */}
                    <img
                      className='img-thumbnail'
                      src={image}
                      alt="Selected"
                      style={{ height: '600px', width: '1400px', objectFit: 'fill' }}
                    />
                  </div>
                )) :
                <>
                  <div key={currentImageIndex}>
                    {/* {handleRemoveImage ? <span onClick={() => handleRemoveImages(currentImageIndex)} style={{ cursor: 'pointer' }}>x</span> : null} */}
                    {fileType === "pdf" ?
                      <iframe
                        className='img-thumbnail'
                        src={images[0]}
                        alt="Selected"
                        style={{ height: '600px', width: '800px', objectFit: 'cover' }}
                      />
                      :
                      <img
                        className='img-thumbnail'
                        src={images[0]}
                        alt="Selected"
                        style={{ height: 'auto',maxHeight:"600px", width: '650px', objectFit: 'cover' }}
                      />
                    }

                  </div>
                </>
            }


            {/* {images > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`Selected ${currentImageIndex + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                    }}
                  />
                  <div style={{ marginTop: '10px' }}>
                    {images.map((image, index) => (
                      <span
                        key={index}
                        className={`mx-2 ${index === currentImageIndex ? 'font-weight-bold' : ''}`}
                        style={{ cursor: "pointer" }}
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p>No images selected.</p>
              )} */}
          </Slider>
        </ModalBody>

      </Modal>

    </div>


  );
}

export default ModalComponent;

