import database from "../../database/connection";
import {CreateEtiqueta, UpdateEtiquetas} from "../../entities/Etiquetas";


class EtiquetasRepository {

  /**
   * Obtiene las etiquetas del usuario autenticado
   * @param userId
   */
   async getEtiquetas(userId: string): Promise<any> {

    const query = `
        SELECT
            E.id          AS "etiquetaId",           
            E.name        AS "etiquetaName",         
            E.color_hex   AS "colorHex",  
            E.created_at  AS "createdAt"
        FROM etiquetas E     
        WHERE E.deleted_at IS NULL
          AND E.user_id = $1;
    `;

    const { rows } = await database.query(query, [userId]);
    return rows;
  }

  /**
   * Registro de una nueva etiqueta.
   * @param data<CreateEtiqueta>
   * @param userId
   */
  async createEtiqueta(data: CreateEtiqueta,userId: string): Promise<void> {

    const query = `INSERT INTO etiquetas (
                    user_id,
                    name,
                    color_hex                  
    ) VALUES ($1, $2, $3);`;
    const parameters = [
      userId,
      data.name,
      data.color
    ];

    await database.query(query, parameters);
  }

  /**
   * Actualizar una etiqueta.
   * @param data<UpdateEtiquetas>
   * @param etiquetaId
   * @param userId
   */
  async updateEtiqueta(data: UpdateEtiquetas, etiquetaId:string, userId: string): Promise<void> {

    const query = `UPDATE etiquetas SET                    
                    name = $1,
                    color_hex = $2                    
                  WHERE id = $3 AND user_id = $4;`;
    const parameters = [
      data.name,
      data.color,
      etiquetaId,
      userId,
    ];

    await database.query(query, parameters);
  }

  /**
   * Eliminar una etiqueta.
   * @param etiquetaId
   * @param userId
   */
  async deleteEtiqueta(etiquetaId:string, userId: string): Promise<void> {

    const query = `UPDATE etiquetas SET                    
                    deleted_at = NOW()
                  WHERE id = $1 AND user_id = $2;`;
    const parameters = [
      etiquetaId,
      userId,
    ];

    await database.query(query, parameters);
  }

}

export default new EtiquetasRepository();