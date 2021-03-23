import { mdiViewList } from "@mdi/js";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import useFirestoreDocument from "../../components/hooks/useFirestoreDocument";
import useFirestoreDocumentReference from "../../components/hooks/useFirestoreDocumentReference";
import useFilteredHeroes from "../../components/pages/HeroList/hooks/useFilteredHeroes";
import useFilters from "../../components/pages/HeroList/hooks/useFilters";
import useGetValue from "../../components/pages/HeroList/hooks/useGetValue";
import useLoadId from "../../components/pages/HeroList/hooks/useLoadId";
import Filters from "../../components/pages/HeroList/ui/Filters";
import HeroLine from "../../components/pages/HeroList/ui/HeroLine";
import ShareBanner from "../../components/pages/HeroList/ui/ShareBanner";
import TitleLine from "../../components/pages/HeroList/ui/TitleLine";
import useSetLevel from "../../components/pages/TiersList/hooks/useSetLevel";
import ProfileContext from "../../components/providers/ProfileContext";
import IFirebaseHeroes from "../../components/providers/types/IFirebaseHeroes";
import LoginButton from "../../components/ui/button/LoginButton";
import Card from "../../components/ui/card/Card";
import CardHelp from "../../components/ui/card/CardHelp";
import CardTitle from "../../components/ui/card/CardTitle";
import CheckboxField from "../../components/ui/CheckboxField";
import TwoColsSticky from "../../components/ui/layout/TwoColsSticky";
import heroesJson from "../../data/heroes.json";
import { useTranslation } from "../../i18n";
import ICharacter from "../../types/ICharacter";

const typedHeroes: ICharacter[] = heroesJson as ICharacter[];

interface IProps {
  [key: string]: never;
}

const HeroList: React.FC<IProps> = () => {
  const { t } = useTranslation("hero-list");
  const router = useRouter();
  const { values } = useContext(ProfileContext);
  const { id } = router.query;

  const [unlockFi, setUnlockFi] = useState(false);
  const [state, dispatch] = useFilters();

  const userId = useLoadId(id as string);

  const document = useFirestoreDocumentReference(userId ? `heroes/${userId}` : undefined);
  const result = useFirestoreDocument<IFirebaseHeroes>(document);
  const heroes = result.data?.heroes || [];
  const isSelf = userId === values.userId;

  const setLevel = useSetLevel(document, heroes);
  const getValue = useGetValue(heroes);

  const characters = useFilteredHeroes(typedHeroes, heroes, state);

  if (values.isAuth === false) {
    return (
      <Card>
        <CardTitle>{t("common:require-login")}</CardTitle>
        <LoginButton />
      </Card>
    );
  }

  return (
    <>
      <TwoColsSticky>
        <Card>
          <CardTitle icon={mdiViewList}>{t("common:menu.hero-list")}</CardTitle>

          {id && id.length < 12 ? <CardHelp>{t("moved")}</CardHelp> : null}

          <ShareBanner isView={isSelf === false} />
          <Head>
            <title>{`${t("common:menu.hero-list")} - Afkalc`}</title>
            <meta name="description" content="" />
          </Head>

          <Filters state={state} dispatch={dispatch} />

          <CheckboxField
            name="unlockFi"
            onChange={setUnlockFi}
            value={unlockFi}
            label={t("label-unlock-fi")}
          />
        </Card>
      </TwoColsSticky>

      <Card>
        <CardTitle icon={mdiViewList}>{t("common:menu.hero-list")}</CardTitle>
        {characters.length === 0 ? (
          <CardHelp>{t("label-empty")}</CardHelp>
        ) : (
          <div style={{ paddingBottom: "16px" }}>
            {characters.map((character, i) => (
              <React.Fragment key={character.id}>
                {character.faction !== characters[i - 1]?.faction ? <TitleLine /> : null}
                <HeroLine
                  id={character.id}
                  name={character.name}
                  setLevel={setLevel}
                  getValue={getValue}
                  isView={isSelf === false}
                  faction={character.faction}
                  link={character.link}
                  shouldUnlockFi={unlockFi}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default HeroList;
