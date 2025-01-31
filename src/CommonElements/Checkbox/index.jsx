const CustomCheckbox = ({ checked, onChange, style }) => {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={style}
      />
    );
  };
  
  export default CustomCheckbox;