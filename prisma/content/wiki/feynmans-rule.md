# Feynman's Rule

Feynman's rule, or differentiation under the integral sign, introduces a parameter into the integral, differentiates with respect to that parameter, and integrates the simpler result back.

$$
\frac{d}{dt} \int_a^b f(x, t) \, dx = \int_a^b \frac{\partial f}{\partial t}(x, t) \, dx.
$$

This is valid when $f$ and $\frac{\partial f}{\partial t}$ are continuous and the integrals converge nicely, which is the case in every contest problem you will meet.

## Example

$$
\int_0^1 \frac{x - 1}{\ln x} \, dx
$$

The $\ln x$ in the denominator is the obstacle, and $\frac{d}{dt} x^t = x^t \ln x$ is exactly what cancels it.
Define

$$
I(t) = \int_0^1 \frac{x^t - 1}{\ln x} \, dx, \qquad I(0) = 0.
$$

Differentiating under the integral sign,

$$
I'(t) = \int_0^1 x^t \, dx = \frac{1}{t + 1},
$$

so $I(t) = \ln(t + 1)$ and the original integral is $I(1) = \ln 2$.

## Choosing the parameter

- Put the parameter where differentiating it cancels the ugliest part of the integrand, as $x^t$ cancelled $\ln x$ above.
- $e^{-tx}$ is a useful damping factor for integrals over $[0, \infty)$ such as $\int_0^\infty \frac{\sin x}{x} \, dx = \frac{\pi}{2}$.
- Always find a value of the parameter where the integral is easy (often $0$ or $\infty$) to fix the constant of integration.

## Frullani integrals

A close relative: for suitable $f$,

$$
\int_0^\infty \frac{f(ax) - f(bx)}{x} \, dx = \big(f(0) - f(\infty)\big) \ln\frac{b}{a}.
$$

With $f(x) = e^{-x}$, $a = 1$, $b = 2$ this gives $\int_0^\infty \frac{e^{-x} - e^{-2x}}{x} \, dx = \ln 2$ immediately.
