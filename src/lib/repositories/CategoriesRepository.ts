import database from "../../database/connection";
import {CreateCategory, UpdateCategory} from "../../entities/Categories";


class CategoriesRepository {

  /**
   * Obtiene las categorias del usuario autenticado
   * @param userId
   */
   async getCategories(userId: string): Promise<any> {

    const query = `
        SELECT
            C.id          AS "categoriaId",           
            C.name        AS "categoriaName",         
            C.color_hex   AS "colorHex",  
            C.created_at  AS "createdAt"
        FROM categorias C      
        WHERE C.deleted_at IS NULL
          AND C.user_id = $1;
    `;

    const { rows } = await database.query(query, [userId]);
    return rows;
  }

  /**
   * Registro de una nueva categoria.
   * @param data<CreateCategory>
   * @param userId
   */
  async createCategory(data: CreateCategory,userId: string): Promise<void> {

    const query = `INSERT INTO categorias (
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
   * Actualizar una categoria.
   * @param data<UpdateCategory>
   * @param categoryId
   * @param userId
   */
  async updateCategory(data: UpdateCategory, categoryId:string, userId: string): Promise<void> {

    const query = `UPDATE categorias SET                    
                    name = $1,
                    color_hex = $2                    
                  WHERE id = $3 AND user_id = $4;`;
    const parameters = [
      data.name,
      data.color,
      categoryId,
      userId,
    ];

    await database.query(query, parameters);
  }

  /**
   * Eliminar una categoria.
   * @param categoryId
   * @param userId
   */
  async deleteCategory(categoryId:string, userId: string): Promise<void> {

    const query = `UPDATE categorias SET                    
                    deleted_at = NOW()
                  WHERE id = $1 AND user_id = $2;`;
    const parameters = [
      categoryId,
      userId,
    ];

    await database.query(query, parameters);
  }

}

export default new CategoriesRepository();