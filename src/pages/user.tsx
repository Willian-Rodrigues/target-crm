import React from "react";
import {
  CardsContainer,
  UserHeaderContainer,
  UserPageContainer,
  NewUserButtonContainer,
  TitleContainer,
} from "@styles/pagesStyle/user.style";
import UserCard from "ui/components/UserCard/UserCard";
import SearchButtom from "ui/components/SearchButton/SearchButton";
import Title from "ui/components/Title/Title";
import { Button, Tooltip } from "@material-ui/core";
import CreateUserModal from "ui/components/Modal/CreateUserModal";
import { useUserPage } from "data/services/hooks/PageHooks/UserHook";
import UserDetailModal from "ui/components/Modal/UserDetailModal";
import { mockRoles } from "data/utils/mock";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { parseCookies } from "data/services/cookie";
import { serviceApi } from "data/services/ServiceApi";

function UserPage() {
  const { users, filteredUser, removeFiltered, getData } = useUserPage();

  const [valueType, setValueType] = React.useState("name");
  const [hasFiltered, setHasFiltered] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openDetailUserModal, setOpenDetailUserModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState({});

  const [time, setTime] = React.useState(null);

  const handleChangeSearchTerm = (event) => {
    if (hasFiltered) {
      removeFiltered(true);
    }
    setSearchTerm(event.target.value);
    if (time) {
      clearTimeout(time);
      setTime(null);
    }
    setTime(
      setTimeout(() => {
        filteredUser(event.target.value, valueType);
        setHasFiltered(true);
      }, 1000)
    );
    clearTimeout(time);
  };

  const removeFilters = () => {
    removeFiltered(false);
    setHasFiltered(false);
    setSearchTerm("");
  };

  return (
    <UserPageContainer>
      <CreateUserModal
        open={openCreateUserModal}
        setOpen={setOpenCreateUserModal}
        getData={getData}
      />
      <UserDetailModal
        open={openDetailUserModal}
        setOpen={setOpenDetailUserModal}
        user={selectedUser}
        getData={getData}
      />

      <UserHeaderContainer>
        <Head>
          <title>Usuários | Target</title>
        </Head>

        <TitleContainer>
          <Title title="Gerenciamento de Usuários"></Title>
        </TitleContainer>

        <SearchButtom
          placeholder="Buscar"
          buttomIcon="fa-search"
          viewButtonGroup={true}
          typeValue={valueType}
          selectListValues={mockRoles}
          searchTypes={[
            { value: "name", name: "Nome" },
            { value: "role", name: "Perfil" },
          ]}
          ChangeType={(event) => {
            setValueType(event.target.value);
          }}
          onChange={(event) => {
            handleChangeSearchTerm(event);
          }}
          value={searchTerm}
          onClick={removeFilters}
          hasFiltered={hasFiltered}
        />
      </UserHeaderContainer>
      <NewUserButtonContainer>
        <Tooltip
          title="Adicionar usuário"
          placement="top-start"
          enterDelay={500}
          leaveDelay={100}
        >
          <Button
            variant="contained"
            sx={{ width: "auto", height: "30px" }}
            color="primary"
            onClick={() => setOpenCreateUserModal(true)}
            type="submit"
          >
            <i className="fa fa-plus" style={{ marginRight: "2px" }}></i> Novo
            usuário
          </Button>
        </Tooltip>
      </NewUserButtonContainer>

      <CardsContainer>
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            email={user.email}
            role={user.role}
            picture={user.picture}
            onClick={() => {
              setSelectedUser(user);
              setOpenDetailUserModal(true);
            }}
          />
        ))}
      </CardsContainer>
    </UserPageContainer>
  );
}

export default UserPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  resolvedUrl,
}): Promise<any> => {
  const data = parseCookies(req);
  let token: string = "";

  Object.keys(data).find((key, i) => {
    if (key === "@target:user") {
      token = Object.values(data)[i];
    }
  });
  if (!token?.length && resolvedUrl !== "/login") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    try {
      serviceApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await serviceApi.get("/auth/faw1efawe3f14aw8es3v6awer51xx3/check");
    } catch (e) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      session: "",
    },
  };
};