import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export type ModalProps = {
  open?: boolean;
  title?: string;
  closeButton?: boolean;
  onClose: () => void;
};

export const Modal = ({
  open = false,
  title = "",
  closeButton = true,
  onClose,
  children,
}: React.PropsWithChildren<ModalProps>) => {
  const [root, setRoot] = React.useState<Element | null>(null);

  useEffect(() => {
    setRoot(document.querySelector("#modal-portal"));
  }, []);

  return open && root
    ? createPortal(
        <div
          onClick={(evt) => {
            if (evt.target === evt.currentTarget) onClose();
          }}
          className="bg-gray-500/50 w-full h-screen flex items-center justify-center pointer-events-auto md:p-8"
        >
          <div className="flex flex-col items-stretch bg-white md:rounded-md w-full h-full md:w-2/3 md:max-h-full p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">{title}</h2>
              {closeButton && (
                <div
                  onClick={onClose}
                  className="flex items-center justify-center rounded-full border-2 border-black border-solid w-8 h-8 cursor-pointer"
                >
                  <FiX />
                </div>
              )}
            </div>
            <div className="overflow-hidden h-full">{children}</div>
          </div>
        </div>,
        root
      )
    : null;
};