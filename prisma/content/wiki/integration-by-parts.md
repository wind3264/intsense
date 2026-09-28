# Integration by Parts

Integration by parts is the product rule run backwards:

$$
\int u \, dv = uv - \int v \, du.
$$

The goal is to choose $u$ and $dv$ so that $\int v \, du$ is easier than the integral you started with.

## Choosing u

A common heuristic is LIATE: pick $u$ from whichever comes first in the list logarithmic, inverse trig, algebraic, trigonometric, exponential.
Functions early in the list get simpler when differentiated; functions late in the list are easy to integrate.

## Example

$$
\int x e^x \, dx
$$

Take $u = x$ and $dv = e^x \, dx$, so $du = dx$ and $v = e^x$:

$$
\int x e^x \, dx = x e^x - \int e^x \, dx = (x - 1)e^x + C.
$$

## The lone-function trick

A single function like $\ln x$ or $\arctan x$ can be integrated by parts with $dv = dx$.
For example, with $u = \ln x$:

$$
\int \ln x \, dx = x \ln x - \int x \cdot \frac{1}{x} \, dx = x \ln x - x + C.
$$

## Cyclic integrals

For $\int e^x \sin x \, dx$, integrating by parts twice brings back the original integral $I$:

$$
I = e^x \sin x - e^x \cos x - I,
$$

so $I = \frac{e^x(\sin x - \cos x)}{2} + C$.

## Speed tips

- Tabular integration handles $\int p(x) e^{ax} \, dx$ or $\int p(x) \sin(ax) \, dx$ for a polynomial $p$ in one pass: alternate signs on the derivatives of $p$ times the successive antiderivatives of the other factor.
- $\int_0^\infty x^n e^{-x} \, dx = n!$ - worth memorizing.
