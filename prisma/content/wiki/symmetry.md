# Symmetry

Symmetry arguments evaluate integrals that look hopeless by comparing the integral with a reflected copy of itself.
They are the single most common trick in integration bee finals.

## Odd functions

If $f(-x) = -f(x)$, then $\int_{-a}^{a} f(x) \, dx = 0$.
Before doing any work on a symmetric interval, check whether the integrand (or part of it) is odd.

## The King property

$$
\int_a^b f(x) \, dx = \int_a^b f(a + b - x) \, dx.
$$

Write the integral both ways and add.
For example, with $I = \int_0^{\pi/2} \frac{\sin x}{\sin x + \cos x} \, dx$, substituting $x \to \frac{\pi}{2} - x$ swaps sine and cosine:

$$
2I = \int_0^{\pi/2} \frac{\sin x + \cos x}{\sin x + \cos x} \, dx = \frac{\pi}{2}, \qquad I = \frac{\pi}{4}.
$$

The same move handles $\int_0^{\pi/2} \frac{dx}{1 + \tan^k x}$ for any $k$, which is always $\frac{\pi}{4}$.

## Pulling out $x$

On $[0, \pi]$, if $f(\pi - x) = f(x)$, then

$$
\int_0^{\pi} x f(x) \, dx = \frac{\pi}{2} \int_0^{\pi} f(x) \, dx.
$$

This turns $\int_0^{\pi} \frac{x \sin x}{1 + \cos^2 x} \, dx$ into $\frac{\pi}{2} \int_0^{\pi} \frac{\sin x}{1 + \cos^2 x} \, dx = \frac{\pi}{2} \cdot \frac{\pi}{2} = \frac{\pi^2}{4}$.

## Pairing $x$ with $-x$

On $[-a, a]$, add $f(x)$ and $f(-x)$.
For $\int_{-1}^{1} \frac{dx}{(1 + e^x)(1 + x^2)}$, the identity $\frac{1}{1 + e^x} + \frac{1}{1 + e^{-x}} = 1$ gives

$$
2I = \int_{-1}^{1} \frac{dx}{1 + x^2} = \frac{\pi}{2}, \qquad I = \frac{\pi}{4}.
$$
