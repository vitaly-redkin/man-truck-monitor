import React, { Suspense } from 'react';

import ErrorPage from '../error-page/ErrorPage';
import Map from '../map/Map';

/**
 * Compomnent own props.
 */
interface IOwnProps {
}

/**
 * Interface for the component own state.
 */
interface IOwnState {
  error: Error | undefined;
}

/**
 * The application root component.
 * This ccomponent is a class one because it has an error boundary.
 */
class App extends React.PureComponent<IOwnProps, IOwnState> {
  /**
   * Constructor.
   * 
   * @param props component properties.
   */
  constructor(props: IOwnProps) {
    super(props);

    this.state = { error: undefined, };
  }

  /**
   * Catches error raised in the component.
   *
   * @param error Exception occurred in the component
   * @param errorInfo error information
   */
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.log('Uncaught exception:');
    // eslint-disable-next-line no-console
    console.log(error);
    // eslint-disable-next-line no-console
    console.log(errorInfo);

    this.setState({ error, });
  }

  /**
   * Renders component UI.
   */
  public render(): JSX.Element {
    if (this.state.error) {
      return (
        <Suspense fallback={null}>
          <ErrorPage />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={null}>
        <Map />
      </Suspense>
    );
  }
}

export default App;
