import { toast } from "react-toastify";
import { serviceApi as api } from "./ServiceApi";

class DealsService {
  async getAllDeals() {
    try {
      const { data } = await api.get("/deal?with=pipeline,company,contact");
      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async getTotslDeals(query?: string) {
    try {
      const { data } = await api.get(
        `/deal?with=pipeline,company,contact${query ? query : ""}`
      );

      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async getDeals() {
    try {
      const { data } = await api.get(
        "/deal?status=INPROGRESS&with=pipeline,company,contact"
      );

      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async getDealsCompleted() {
    try {
      const { data } = await api.get(
        "/deal?status__in=WON,LOST,ARCHIVED&with=pipeline,company,contact"
      );
      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async editDeal(dealId, deal) {
    try {
      const { data } = await api.put(`/deal/${dealId}`, deal);
      toast.success(`Negociação alterada com sucesso!`);
      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async createActivity(dealId, activity) {
    try {
      const { data } = await api.post(`deal/${dealId}/activity`, activity);
      toast.success(`Atividade criada com sucesso!`);
      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async updateStatus(dealId, newStatus) {
    try {
      const { data } = await api.put(`deal/${dealId}`, newStatus);
      let status = "";
      switch (newStatus.status) {
        case "WON":
          status = "Ganha";
          break;
        case "LOST":
          status = "Perdida";
          break;
        default:
          status = "Arquivada";
          break;
      }
      toast.success(`Negociação finalizada como "${status}" com sucesso!`);

      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }

  async updateStatusAndRestore(
    dealId: string,
    pipeline: string,
    status: string
  ) {
    try {
      await api.put(`deal/${dealId}`, { pipeline, status });
      toast.success("Negociação restaurada com sucesso!");
      return {
        type: "success",
        message: "Empresa editada com sucesso!",
        title: "Sucesso",
      };
    } catch (error) {
      return {
        type: "error",
        message:
          "Ops! algo deu errado, verifique sua conexão e tente novamente.",
        title: "Erro",
      };
    }
  }

  async deletedDeal(dealId) {
    try {
      await api.delete(`deal/${dealId}`);
      toast.success("Negociação deletada com sucesso!");
    } catch (err) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
    }
  }

  async dealPipelineUpdate(pipeline: string, dealId: string) {
    try {
      const { data } = await api.put(`/deal/${dealId}/pipelineUpdate`, {
        pipeline,
      });
      return data;
    } catch (error) {
      toast.error(
        "Ops! algo deu errado, verifique sua conexão e tente novamente."
      );
      return error;
    }
  }
}

export default new DealsService();
