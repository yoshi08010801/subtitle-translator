// components/ErrorBoundary.tsx
"use client";

import React, { ReactNode } from "react";

interface Props { children: ReactNode; }

interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>何か問題が発生しました。リロードしてください。</div>;
    }
    return this.props.children;
  }
}
