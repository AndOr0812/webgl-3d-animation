BOOK="
// https://stackoverflow.com/questions/28330642/3d-perspective-projection-coordinates-in-clip-space

#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define DEG2RAD 0.01745329f

void m3d_matrixMul(const float matrix1[], const float matrix2[], float destination[])
{
    int i, row, col;

    for (i = 15; i >= 0; i--)
    {
        row = i % 4;
        col = i / 4 * 4;
        destination[i] = matrix1[row] * matrix2[col] + matrix1[row + 4] * matrix2[col + 1] + matrix1[row + 8] * matrix2[col + 2] + matrix1[row + 12] * matrix2[col + 3];
    }
}

void m3d_matVecMul(const float matrix[], const float vector[], float destination[])
{
    float x = vector[0], y = vector[1], z = vector[2], w = vector[3];

    destination[0] = x * matrix[0] + y * matrix[4] + z * matrix[8] + w * matrix[12];
    destination[1] = x * matrix[1] + y * matrix[5] + z * matrix[9] + w * matrix[13];
    destination[2] = x * matrix[2] + y * matrix[6] + z * matrix[10] + w * matrix[14];
    destination[3] = x * matrix[3] + y * matrix[7] + z * matrix[11] + w * matrix[15];
}

void m3d_getFrustum(float left, float right, float bottom, float top, float near, float far, float matrix[])
{
    matrix[0] = 2.0f * near / (right - left);
    matrix[1] = 0.0f;
    matrix[2] = 0.0f;
    matrix[3] = 0.0f;
    matrix[4] = 0.0f;
    matrix[5] = 2.0f * near / (top - bottom);
    matrix[6] = 0.0f;
    matrix[7] = 0.0f;
    matrix[8] = (right + left) / (right - left);
    matrix[9] = (top + bottom) / (top - bottom);
    matrix[10] = -(far + near) / (far - near);
    matrix[11] = -1.0f;
    matrix[12] = 0.0f;
    matrix[13] = 0.0f;
    matrix[14] = -2.0f * far * near / (far - near);
    matrix[15] = 0.0f;
}

void m3d_getPerspective(float vfov, float aspect, float near, float far, float matrix[])
{
    float height = tanf(vfov * 0.5f * DEG2RAD) * near;
    float width = aspect * height;
    m3d_getFrustum(-width, width, -height, height, near, far, matrix);
}

void m3d_getIdentity(float matrix[])
{
    matrix[0] = 1.0f;
    matrix[1] = 0.0f;
    matrix[2] = 0.0f;
    matrix[3] = 0.0f;
    matrix[4] = 0.0f;
    matrix[5] = 1.0f;
    matrix[6] = 0.0f;
    matrix[7] = 0.0f;
    matrix[8] = 0.0f;
    matrix[9] = 0.0f;
    matrix[10] = 1.0f;
    matrix[11] = 0.0f;
    matrix[12] = 0.0f;
    matrix[13] = 0.0f;
    matrix[14] = 0.0f;
    matrix[15] = 1.0f;
}

void m3d_translate(float x, float y, float z, float matrix[])
{
    matrix[12] += x;
    matrix[13] += y;
    matrix[14] += z;
}

int main(void)
{
    float vertex[4] = {0.5f, 0.5f, 0.5f, 1.0f};
    float modelView[16];
    float projection[16];
    float mvp[16];
    char buffer[4];

    m3d_getIdentity(modelView);
    m3d_translate(0.0f, 0.0f, -2.0f, modelView);
    m3d_getPerspective(45.0f, 800.0f / 600.0f, -0.5f, -1000.0f, projection);
    m3d_matrixMul(projection, modelView, mvp);
    m3d_matVecMul(mvp, vertex, vertex);

    printf( Projected vertex: %f, %f, %f, %f\n , vertex[0], vertex[1], vertex[2], vertex[3]);
    printf( Press ENTER to quit. );
    fgets(buffer, 4, stdin);
    return EXIT_SUCCESS;
}
"
