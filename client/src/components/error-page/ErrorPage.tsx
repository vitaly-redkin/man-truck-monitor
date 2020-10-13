import * as React from 'react';

import { Container, Row, Col } from 'reactstrap';

import './ErrorPage.css';

/**
 * The Error Page component.
 * 
 * In the real life there would be a ling to provide an error description
 * and store it in, for example, Sentry.
 */
function ErrorPage(): JSX.Element {
  /**
   * Renders component content.
   */
  const render = (): JSX.Element => {
    return (
      <div className="w-100">
        <div className='error-page'>
          <Container className='align-self-center'>
            <Row>
              <Col className='text-center'>
                <h3>Thank you for using MAN Truck Monitor</h3>
              </Col>
            </Row>
            <Row>
              <Col className='text-center'>
                <p>
                  We are really sorry but some unexpected problem occurred.
                  <br />
                  Our team already notified about this problem and will resolve it a.s.a.p.
                </p>
                <p>
                  Meanwhile please refresh the page and try again to repeat your last action.
                  {' '}
                  <br />
                  If the problem persists please give us some time to fix it.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  };

  return render();
}

export default ErrorPage;
