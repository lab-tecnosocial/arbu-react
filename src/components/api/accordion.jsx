import { Link, useLocation, useNavigate } from "react-router-dom";
// import './APIComponent.css'
import { useRef, useState } from "react";

const Accordion = ({ id, itemName, itemContent, currentActive, onClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const innerRef = useRef()
  const [isActive, setIsActive] = useState(false)
  const [ancorColor, setAncorColor] = useState(null)

  const toggleOpen = () => {
    if (currentActive === 0) {
      setIsActive(true)
    }
    else if (isActive === true && currentActive !== id) {
      setIsActive(true)
    }
    else {
      setIsActive(!isActive)
    }
  }

  const getUrl = () => {
    const pathname = location.pathname.split('/')
    if (pathname[2] !== itemName.path) {
      navigate(itemName.path)
    }
  }

  return (
    <div className="accordion">
      <div className="accordion__header">
        <div className="ancor">
          <Link
            to={itemName.path}
            onClick={() => {
              toggleOpen()
              onClick(id)
              setAncorColor(null)
              window.scrollTo(0, 0)
            }}
            style={{ fontWeight: isActive ? '600' : '400' }}
          >
            {itemName.label}
          </Link>
        </div>
        {
          itemContent ?
            <svg style={{ transform: isActive ? 'rotate(90deg)' : "none" }} className="arrow-icon" width="18" height="18" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m8.625 5.25 6.75 6.75-6.75 6.75"></path>
            </svg>
            : null
        }
      </div>
      {
        itemContent ? (
          <div
            className="accordion__content"
            style={{ height: isActive ? `${innerRef.current.clientHeight}px` : '0px' }}
          >
            <div ref={innerRef} className="accordion__content-inner" >
              {itemContent.map((item, i) => {
                const { label, path } = item
                return (
                  <div key={label + i} className={`link ${ancorColor === i && currentActive === id ? 'active-link' : ''}`}>
                    <a
                      href={path}
                      onClick={() => {
                        getUrl()
                        setAncorColor(i)
                        onClick(id)
                      }}
                      style={{
                        color: ancorColor === i && currentActive === id ? '#7BA05B' : 'black',
                      }}
                    >
                      {label}
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

export default Accordion;
