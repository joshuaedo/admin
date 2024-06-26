import { createNewCategory } from '@/features/categories/lib/mutations';
import { CreateCategoryValidator } from '@/features/categories/types/validators';
import { checkShopOwner } from '@/features/shop/lib/queries';
import { getLoggedInUserId } from '@/features/user/lib/queries';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const userId = await getLoggedInUserId();

    const body = await req.json();

    const { name, shopId, images, slug } =
      CreateCategoryValidator.parse(body);

    if (!userId) {
      return new Response('Unauthenticated', { status: 401 });
    }

    if (!name.trim()) {
      return new Response('Missing name', { status: 400 });
    }

    const isShopOwner = await checkShopOwner(shopId, userId);

    if (!isShopOwner) {
      return new Response('Unauthorized', { status: 401 });
    }

    const newCategory = await createNewCategory({
      name,
      shopId,
      images,
      creatorId: userId,
      slug,
    });

    return new Response(JSON.stringify(newCategory), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, {
        status: 422,
      });
    }

    return new Response(error + ' Could not create category', { status: 500 });
  }
}
