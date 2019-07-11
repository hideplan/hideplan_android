import React from "react";
import "./Terms.css";



class Rules extends React.Component {
  render() {
    return (
      <ul className="title-container">
      <h3 className="terms-title">Terms of use</h3>
      <p className="terms-text">
          Respect others
        </p><br/>
        <p className="terms-text">
          Attacks, harassment and spamming is not allowed. Please report such behaviour.
        </p><br/>
        <p className="terms-text">
          Commercial, violent or pornography content is not allowed.
        </p>
      </ul>
    )
  }
}
class Privacy extends React.Component {
  render() {
    return (
      <ul className="title-container">
      <h3 className="terms-title">Privacy policy</h3>
      <p className="terms-text">
        We value privacy, so you don't have to identificate with email, but
        cost is high. If you forget password, you will loose access to your
        account.
        </p><br/>
        <p className="terms-text">
          For basic functionality site serves you just one cookie.
        </p><br/>
        <p className="terms-text">
          Your password is hashed before saving to database.
        </p>
        <br/>
        <p className="terms-text">
          Your last login is saved after every successful attempt.        </p>
          <br/>
        <p className="terms-text">
          Site tracks basic information about traffic. It mean mostly how many users are connected at certain point of time.</p>
      </ul>
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer">
      <p>Any requests, ideas or bugs please email here:</p>
      <p>contact@ventpuff.com</p>
      </div>
      </div>
    )
  }
}




class Terms extends React.Component {
  render() {

    return (
      <div className="intro-wrapper" >
        <div className="intro-body">
        <Rules/>
        <Privacy/>

        </div>
        <Footer />
      </div>
    );
  }
}

export default Terms;
