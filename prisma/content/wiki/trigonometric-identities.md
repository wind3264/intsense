# Trigonometric Identities

Many trig integrals become routine once the integrand is rewritten with the right identity.
Knowing a handful of identities cold is one of the biggest speed gains in an integration bee.

## Power reduction

$$
\sin^2 x = \frac{1 - \cos 2x}{2}, \qquad \cos^2 x = \frac{1 + \cos 2x}{2}.
$$

These make even powers of sine and cosine integrable.
For example,

$$
\int_0^{\pi/2} \sin^2 x \, dx = \int_0^{\pi/2} \frac{1 - \cos 2x}{2} \, dx = \frac{\pi}{4}.
$$

For odd powers, split off one factor and use $\sin^2 x = 1 - \cos^2 x$ followed by a u-substitution instead.

## Half-angle forms

$$
1 + \cos x = 2\cos^2\frac{x}{2}, \qquad 1 - \cos x = 2\sin^2\frac{x}{2}.
$$

So

$$
\int \frac{dx}{1 + \cos x} = \int \frac{1}{2}\sec^2\frac{x}{2} \, dx = \tan\frac{x}{2} + C.
$$

## The secant integral

Multiplying by $\frac{\sec x + \tan x}{\sec x + \tan x}$ makes the numerator the derivative of the denominator:

$$
\int \sec x \, dx = \ln\left|\sec x + \tan x\right| + C.
$$

## Speed tips

- Over a full period, $\sin^2$ and $\cos^2$ each average to $\frac{1}{2}$, so $\int_0^{\pi} \sin^2 x \, dx = \frac{\pi}{2}$ with no work.
- Wallis: $\int_0^{\pi/2} \sin^n x \, dx = \frac{n - 1}{n} \int_0^{\pi/2} \sin^{n-2} x \, dx$, which gives $\int_0^{\pi} \sin^4 x \, dx = \frac{3\pi}{8}$ quickly.
