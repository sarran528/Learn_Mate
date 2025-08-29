import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, message: error?.message || String(error) };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl border bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
          <p className="font-semibold mb-1">Something went wrong rendering this section.</p>
          {this.state.message && (
            <pre className="text-xs whitespace-pre-wrap opacity-80">{this.state.message}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
