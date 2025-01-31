import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

const DropdownCommon = ({ dropdownMain, icon = true, iconName, btn, options, onSelect }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleClick = (item) => {
    onSelect(item); // Call the onSelect function passed from the parent component
  };

  return (
    <Dropdown {...dropdownMain} isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle {...btn}>
        {icon && <i className={iconName}></i>}
        {!icon && options[0]?.name}
      </DropdownToggle>
      <DropdownMenu style={{ overflowY: 'scroll', height: "auto" }}>
        {options.map((item, i) => (
          <DropdownItem
            key={i}
            onClick={() => handleClick(item)}
            style={{
              color: 'black',
              transition: 'background-color 0.3s, color 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.color = '#007bff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'black';
            }}
          >
            <i className={item.icon}></i>{' '} {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownCommon;
