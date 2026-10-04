import React, { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

/**
 * 계좌번호 시트. 배경을 누르거나 Esc를 누르면 닫힙니다.
 *
 * @param accounts  [{ title, bank_name, account_owner, account_number }]
 */
const AccountModal = ({ accounts, onClose, copied, onCopy }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, [onClose]);

  return (
    <div
      className="sheet-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="신부 측 계좌번호"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="account-sheet">
        <p className="eyebrow eyebrow--ko">마음 전하실 곳</p>
        <span className="ornament" aria-hidden="true" />

        <div className="account-list">
          {accounts.map((item) => (
            <div className="account-row" key={item.account_number}>
              <p className="account-title">{item.title}</p>
              <p className="account-meta">
                {item.bank_name} · 예금주 {item.account_owner}
              </p>
              <p className="account-number">{item.account_number}</p>

              <CopyToClipboard
                text={item.account_number}
                onCopy={() => onCopy(item.account_number)}
              >
                <button className="chip account-copy">
                  {copied === item.account_number ? "복사되었습니다" : "복사하기"}
                </button>
              </CopyToClipboard>
            </div>
          ))}
        </div>

        <button className="btn btn--ghost" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AccountModal;
