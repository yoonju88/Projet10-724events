import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    message: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
  }
  const isFormValid = () => {
    const { nom, prenom, email, message } = formData;
    return (
      nom.trim() !== '' &&
      prenom.trim() !== '' &&
      email.trim() !== '' &&
      isEmailValid(email) &&
      message.trim() !== ''
    );
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      if (!isFormValid()) {
        return;
      }
      setSending(true);
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          message: ''
        });
        onSuccess()
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [formData, onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder="Nom"
            label="Nom"
            name="nom"
            type={FIELD_TYPES.INPUT_TEXT}
            value={formData.nom}
            onChange={handleChange}
          />
          <Field
            placeholder="Prénom"
            label="Prénom"
            name="prenom"
            type={FIELD_TYPES.INPUT_TEXT}
            value={formData.prenom}
            onChange={handleChange}
          />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            required
          />
          <Field
            placeholder="Email"
            label="Email"
            name="email"
            type={FIELD_TYPES.EMAIL}
            value={formData.email}
            onChange={handleChange}
          />
          <Button
            type={BUTTON_TYPES.SUBMIT}
            disabled={sending}
          >
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>

        <div className="col">
          <Field
            placeholder="Message"
            label="Message"
            name="message"
            type={FIELD_TYPES.TEXTAREA}
            value={formData.message}
            onChange={handleChange}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
