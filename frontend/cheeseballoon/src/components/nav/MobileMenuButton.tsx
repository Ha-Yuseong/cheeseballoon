"use client";

import { useState } from "react";
import styles1 from "src/components/nav/MenuButton.module.scss";
import Image from "next/image";
import menu from "public/svgs/big.png";

interface MobileMenuButtonProps {
  onToggle: () => void;
}

export default function MobileMenuButton({ onToggle }: MobileMenuButtonProps) {
  const handleClick = () => {
    onToggle();
  };

  return (
    <div className={styles1.button}>
      <div className={styles1.Wrapper}>
        <Image
          src={menu}
          alt=""
          onClick={handleClick}
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
