"use client";

import { useEffect } from "react";
import { guardDomain } from "../lib/official-host";

// Lớp chống sao chép thứ hai (nằm trong file JS): phòng khi bản chép gỡ script đầu <head>.
// Trên tên miền chính chủ, localhost và IP nội bộ thì không làm gì.
export function DomainGuard() {
  useEffect(() => {
    guardDomain();
  }, []);
  return null;
}
