import i18n from "i18next";
import React from "react";
import resources from "../../../data/resources.json";
import { useTranslation } from "../../../i18n";
import styles from "./Item.module.css";

i18n.loadNamespaces("common");

interface IProps {
  size?: "large" | "small" | "default";
  count?: number;
  name: string;
  infos?: string;
  highlight?: boolean;
  secondaryInfos?: string;
  onClick?: () => void;
}

/**
 * TODO: Use i18n for name
 */
const Item: React.FC<IProps> = ({
  count = 1,
  name,
  size = "default",
  infos,
  secondaryInfos,
  onClick = () => {},
  highlight = false,
}) => {
  const { t } = useTranslation("common");
  const resource = resources.find((r) => r.name === name);

  if (resource === undefined) return null;

  const largeClassName = size === "large" ? styles.Large : "";
  const smallClassName = size === "small" ? styles.Small : "";
  const highlightClassName = highlight ? styles.Highlight : "";

  return (
    <div
      className={`${styles.Wrapper} ${largeClassName} ${smallClassName} ${highlightClassName}`}
      onClick={onClick}
      role="button"
      tabIndex={-1}
      onKeyPress={(event) => {
        if (event.key === "Enter") onClick();
      }}
    >
      <img src={resource.image} className={styles.Item} alt={t(`item.${name}`)} />
      {infos ? <span className={styles.Infos}>{t(`duration.${infos}`)}</span> : null}
      {secondaryInfos ? (
        <span className={styles.SecondaryInfos}>{t(`improvment.${secondaryInfos}`)}</span>
      ) : null}
      {count > 1 ? <span className={styles.Count}>{count}</span> : null}
    </div>
  );
};

export default Item;