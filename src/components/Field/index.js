import PropTypes from "prop-types";
import "./style.scss";

export const FIELD_TYPES = {
  INPUT_TEXT:  1,
  TEXTAREA: 2,
  EMAIL: 3,
};

const Field = ({ type, label, name, placeholder, value, onChange}) => {
   let component;

  switch (type) {
    case FIELD_TYPES.INPUT_TEXT:
      component = (
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          data-testid="field-testid"
          id={name}
          value = {value}
          onChange={onChange} 
          required  
        />
      );
      break;
      case FIELD_TYPES.EMAIL :
      component = (
        <input 
          type="email"
          name={name}
          placeholder={placeholder}
          data-testid="field-testid"
          id={name}
          value = {value}
          onChange={onChange}
          autoComplete="off"
          className="inputEmail"
          required 
 
        />
      );
      break;
    case FIELD_TYPES.TEXTAREA:
      component = (
        <textarea 
          name={name} 
          data-testid="field-testid" 
          placeholder={placeholder}
          id={name}
          value = {value}
          onChange={onChange}
          required 
        />
      );
      break;
    default:
      component = (
        <input
          name={name}
          placeholder={placeholder}
          data-testid="field-testid"
          id={name}
          value = {value}
          onChange={onChange}
        />
      );
    break;
  }
  return (
    <div className="inputField">
      <label htmlFor={name}>{label}</label>
      {component}
    </div>
  );
};

Field.propTypes = {
  type: PropTypes.oneOf(Object.values(FIELD_TYPES)),
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange:PropTypes.func.isRequired,
};
 Field.defaultProps = {
   label: "",
   placeholder: "",
   type: FIELD_TYPES.INPUT_TEXT,
   name: "field-name",
   value:"",
 }

export default Field;
